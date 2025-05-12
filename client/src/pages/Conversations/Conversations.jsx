import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import socket from "../../socket";
import { format } from "date-fns";

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/messages/conversations",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setConversations(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load conversations");
        setLoading(false);
      }
    };

    fetchConversations();

    // Initialize socket connection
    socket.auth = {
      token: localStorage.getItem("token"),
    };
    socket.connect();

    // Socket event listeners
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("newMessage", (message) => {
      if (
        activeConversation &&
        (message.sender === activeConversation.participant._id ||
          message.receiver === activeConversation.participant._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }

      // Update last message in conversations list
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv._id === message.conversation) {
            return {
              ...conv,
              lastMessage: message.text,
              updatedAt: new Date(),
            };
          }
          return conv;
        })
      );
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("onlineUsers");
      socket.off("newMessage");
      socket.disconnect();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/messages/${activeConversation._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setMessages(response.data);
        } catch (error) {
          toast.error("Failed to load messages");
        }
      };

      fetchMessages();
    }
  }, [activeConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const messageData = {
      conversation: activeConversation._id,
      text: newMessage,
      receiver: activeConversation.participant._id,
    };

    try {
      // Optimistically add the message to the UI
      const tempMessage = {
        _id: Date.now().toString(), // Temporary ID
        sender: user._id,
        text: newMessage,
        createdAt: new Date(),
        conversation: activeConversation._id,
        isOptimistic: true, // Flag for optimistic updates
      };

      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");

      // Send message via socket
      socket.emit("sendMessage", messageData, (response) => {
        // Replace the optimistic message with the real one from server
        if (response.success) {
          setMessages((prev) =>
            prev.map((msg) => (msg.isOptimistic ? response.message : msg))
          );
        } else {
          // Remove the optimistic message if sending failed
          setMessages((prev) => prev.filter((msg) => !msg.isOptimistic));
          toast.error("Failed to send message");
        }
      });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.some((user) => user.userId === userId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversations sidebar */}
      <div className="w-1/3 border-r border-gray-300 bg-white">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-xl font-bold">Conversations</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                activeConversation?._id === conversation._id ? "bg-blue-50" : ""
              }`}
              onClick={() => setActiveConversation(conversation)}
            >
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={
                      conversation.participant.profilePicture ||
                      "https://via.placeholder.com/40"
                    }
                    alt={conversation.participant.fullName}
                    className="w-10 h-10 rounded-full"
                  />
                  {isUserOnline(conversation.participant._id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">
                    {conversation.participant.fullName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                </div>
                <div className="ml-auto text-xs text-gray-500">
                  {format(new Date(conversation.updatedAt), "p")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="p-4 border-b border-gray-300 flex items-center bg-white">
              <div className="relative">
                <img
                  src={
                    activeConversation.participant.profilePicture ||
                    "https://via.placeholder.com/40"
                  }
                  alt={activeConversation.participant.fullName}
                  className="w-10 h-10 rounded-full"
                />
                {isUserOnline(activeConversation.participant._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium">
                  {activeConversation.participant.fullName}
                </p>
                <p className="text-sm text-gray-500">
                  {isUserOnline(activeConversation.participant._id)
                    ? "Online"
                    : "Offline"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`mb-4 flex ${
                    message.sender === user._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === user._id
                        ? "bg-blue-500 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === user._id
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {format(new Date(message.createdAt), "p")}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-300 bg-white">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-500">
                Select a conversation to start messaging
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;
