import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
  FaPhoneSlash,
  FaEllipsisH,
  FaUserFriends,
  FaComments,
} from "react-icons/fa";
import io from "socket.io-client";

const VideoCallRoom = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract session data from location state or query params
  const sessionData = location.state?.sessionData || {};
  const senderId =
    sessionData.senderId ||
    new URLSearchParams(location.search).get("senderId");
  const receiverId =
    sessionData.receiverId ||
    new URLSearchParams(location.search).get("receiverId");

  // Get current user ID from localStorage
  const userId = localStorage.getItem("userId");

  // Determine user role (teacher/student) based on IDs
  const userRole =
    userId === senderId
      ? "teacher"
      : userId === receiverId
      ? "student"
      : "unknown";

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [connectionEstablished, setConnectionEstablished] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatContainerRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  // Check if user role is unknown and redirect if necessary
  useEffect(() => {
    if (userRole === "unknown") {
      toast.error("Unable to determine your role in this session");
      navigate("/accepted-sessions");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Connection status handling
    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      toast.success("Connected to session server");

      // Join the room with all necessary IDs for role determination
      newSocket.emit("join-room", {
        sessionId,
        userId,
        senderId,
        receiverId,
      });
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      toast.error("Failed to connect to session server");
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
      if (peerConnection) {
        peerConnection.close();
      }
      stopAllMediaStreams();
    };
  }, [sessionId, userId, senderId, receiverId]);

  // Initialize WebRTC when socket is ready
  useEffect(() => {
    if (!socket) return;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Add your TURN servers here if needed
      ],
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          sessionId,
          candidate: event.candidate,
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = (event) => {
      console.log("Connection state:", pc.connectionState);
      if (pc.connectionState === "connected") {
        setConnectionEstablished(true);
        toast.success("Connection established with other participant");
      } else if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        setConnectionEstablished(false);
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log("Received remote track", event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    setPeerConnection(pc);

    // Socket event listeners for WebRTC signaling
    socket.on("offer", async (offer) => {
      console.log("Received offer", userRole);
      try {
        if (userRole === "student") {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { sessionId, answer });
        }
      } catch (err) {
        console.error("Error handling offer:", err);
        toast.error("Connection error: " + err.message);
      }
    });

    socket.on("answer", async (answer) => {
      console.log("Received answer", userRole);
      try {
        if (userRole === "teacher") {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (err) {
        console.error("Error handling answer:", err);
        toast.error("Connection error: " + err.message);
      }
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    // Socket event listeners for room events
    socket.on("user-connected", (participant) => {
      const role = participant.userRole === "teacher" ? "Teacher" : "Student";
      toast.success(`${role} joined the session`);
      setParticipants((prev) => [...prev, participant]);
    });

    socket.on("user-disconnected", (socketId) => {
      toast.warning("Other participant left the session");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      setConnectionEstablished(false);
      setParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
    });

    socket.on("room-participants", (roomParticipants) => {
      setParticipants(roomParticipants);
    });

    // Initialize local media
    setupLocalMedia(pc);

    return () => {
      pc.close();
    };
  }, [socket, sessionId, userRole]);

  // Chat event listener
  useEffect(() => {
    if (!socket) return;

    socket.on("chat-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("chat-message");
    };
  }, [socket]);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const setupLocalMedia = async (pc) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to peer connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // If teacher, create offer
      if (userRole === "teacher") {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", { sessionId, offer });
        } catch (err) {
          console.error("Error creating offer:", err);
          toast.error("Could not start call: " + err.message);
        }
      }
    } catch (err) {
      toast.error("Could not access media devices: " + err.message);
      console.error(err);
    }
  };

  const stopAllMediaStreams = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (screenSharing) {
        // Switch back to camera
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        // Replace the video track
        const videoTrack = stream.getVideoTracks()[0];
        const sender = peerConnection
          .getSenders()
          .find((s) => s.track.kind === "video");

        if (sender) {
          sender.replaceTrack(videoTrack);
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Stop the screen stream
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Update state
        localStreamRef.current = stream;
        setScreenSharing(false);
      } else {
        // Start screen sharing
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        screenStreamRef.current = stream;

        // Replace the video track
        const videoTrack = stream.getVideoTracks()[0];
        const sender = peerConnection
          .getSenders()
          .find((s) => s.track.kind === "video");

        if (sender) {
          sender.replaceTrack(videoTrack);
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setScreenSharing(true);

        // Handle when user stops screen sharing
        stream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
      }
    } catch (err) {
      toast.error("Could not share screen: " + err.message);
    }
  };

  const leaveCall = () => {
    if (socket) {
      socket.emit("leave-room", sessionId);
    }
    stopAllMediaStreams();
    navigate("/accepted-sessions");
    toast.success("You left the session");
  };

  const sendMessage = () => {
    if (message.trim() && socket) {
      const newMessage = { sender: "You", text: message };
      setMessages([...messages, newMessage]);
      socket.emit("chat-message", { sessionId, message: newMessage });
      setMessage("");
    }
  };

  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Handle Enter key in chat input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Main Video Area */}
      <div className="flex-grow flex flex-col md:flex-row p-2 gap-2">
        {/* Remote Video (Main) */}
        <div className="flex-grow bg-black rounded-lg relative overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
            {userRole === "teacher" ? "Student" : "Teacher"}
          </div>
        </div>

        {/* Local Video (Small) */}
        <div className="md:w-1/4 bg-black rounded-lg relative overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
            You ({userRole})
          </div>
        </div>

        {/* Chat Panel (Conditional) */}
        {chatOpen && (
          <div className="md:w-1/4 bg-gray-800 rounded-lg flex flex-col">
            <div className="p-3 border-b border-gray-700 font-medium">Chat</div>
            <div
              ref={chatContainerRef}
              className="flex-grow p-3 overflow-y-auto"
            >
              {messages.length === 0 ? (
                <div className="text-gray-400 text-center mt-4">
                  No messages yet
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="mb-3">
                    <div className="text-sm font-medium text-blue-400">
                      {msg.sender}
                    </div>
                    <div className="text-sm bg-gray-700 p-2 rounded">
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-gray-700 flex">
              <input
                type="text"
                value={message}
                onChange={handleMessageChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-grow bg-gray-700 rounded-l px-3 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-r text-sm"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 p-3 flex justify-center items-center space-x-4">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${
            audioEnabled
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-600 hover:bg-red-700"
          }`}
          title={audioEnabled ? "Mute" : "Unmute"}
        >
          {audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${
            videoEnabled
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-600 hover:bg-red-700"
          }`}
          title={videoEnabled ? "Stop Video" : "Start Video"}
        >
          {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`p-3 rounded-full ${
            screenSharing
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          title={screenSharing ? "Stop Sharing" : "Share Screen"}
        >
          <FaDesktop />
        </button>

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`p-3 rounded-full ${
            chatOpen
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          title="Toggle Chat"
        >
          <FaComments />
        </button>

        <button
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
          title="Participants"
        >
          <FaUserFriends />
        </button>

        <button
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
          title="More Options"
        >
          <FaEllipsisH />
        </button>

        <button
          onClick={leaveCall}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700"
          title="Leave Call"
        >
          <FaPhoneSlash />
        </button>
      </div>

      {/* Session Info */}
      <div className="bg-gray-800 p-2 text-center text-sm">
        Session ID: {sessionId} | Role: {userRole} | {participants.length + 1}{" "}
        participants
      </div>
    </div>
  );
};

export default VideoCallRoom;
