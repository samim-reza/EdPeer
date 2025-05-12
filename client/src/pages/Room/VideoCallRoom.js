import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FaShareSquare,
} from "react-icons/fa";

const VideoCallRoom = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Initialize video streams (simulated)
    setupMediaDevices();

    // Simulate participant joining
    setTimeout(() => {
      setParticipants([
        { id: 1, name: "Teacher" },
        { id: 2, name: "Student" },
      ]);
    }, 1000);

    // Cleanup on unmount
    return () => {
      stopAllMediaStreams();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const setupMediaDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Simulate remote stream (in a real app, this would come from WebRTC)
      setTimeout(() => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream.clone();
        }
      }, 1500);
    } catch (err) {
      toast.error("Could not access media devices: " + err.message);
    }
  };

  const stopAllMediaStreams = () => {
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const toggleAudio = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (screenSharing) {
        await setupMediaDevices();
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
      setScreenSharing(!screenSharing);
    } catch (err) {
      toast.error("Could not share screen: " + err.message);
    }
  };

  const leaveCall = () => {
    stopAllMediaStreams();
    navigate("/accepted-sessions");
    toast.success("You left the session");
  };

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { sender: "You", text: message }]);
      setMessage("");

      // Simulate reply
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "Teacher", text: "Thanks for your message!" },
        ]);
      }, 1000);
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
            {participants.find((p) => p.id === 1)?.name || "Remote Participant"}
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
            You
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
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
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
        Session ID: {sessionId} | {participants.length} participants
      </div>
    </div>
  );
};

export default VideoCallRoom;
