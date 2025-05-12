import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "react-hot-toast";
import axios from "axios";
import Sidebar from "./shared/SideBar";

const AcceptedSessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchAcceptedSessions();
    }
  }, [userId]);

  const fetchAcceptedSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/sessions/getAcceptedSessions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSessions(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch accepted sessions"
      );
      setLoading(false);
      toast.error("Failed to fetch accepted sessions");
    }
  };

  const handleJoinRoom = (sessionId) => {
    navigate(`/room/${sessionId}`);
  };

  const handleCancelSession = async (sessionId) => {
    try {
      await axios.put(
        `http://localhost:5000/sessions/changeStatus/${sessionId}`,
        {
          status: "cancelled",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Session cancelled successfully");
      fetchAcceptedSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel session");
    }
  };

  const handleCompleteAsSender = async (sessionId) => {
    try {
      await axios.put(
        `http://localhost:5000/sessions/updateSenderCompleted/${sessionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Marked as completed by sender");
      fetchAcceptedSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete session");
    }
  };

  const handleCompleteAsReceiver = async (sessionId) => {
    try {
      await axios.put(
        `http://localhost:5000/sessions/updateRecieverCompleted/${sessionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Marked as completed by receiver");
      fetchAcceptedSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete session");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Accepted Sessions</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Accepted Sessions</h1>
          <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Accepted Sessions</h1>
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium">Note:</p>
            <p className="text-blue-700">
              Please join the session at the scheduled time. Late joining may
              result in session cancellation.
            </p>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              You don't have any accepted sessions yet.
            </div>
          ) : (
            <div className="grid gap-6">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-lg shadow overflow-hidden border-l-4 border-green-500"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {session.title}
                        </h3>
                        <p className="text-gray-600">{session.category}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {session.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Teacher:</span>{" "}
                          {session.senderName}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Student:</span>{" "}
                          {session.receiverName}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Type:</span>{" "}
                          {session.senderWant === "Teach"
                            ? "Teaching"
                            : "Learning"}{" "}
                          {session.topic}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Date:</span>{" "}
                          {format(new Date(session.startTime), "PPP")}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Time:</span>{" "}
                          {format(new Date(session.startTime), "p")} (
                          {session.duration} mins)
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Credits:</span>{" "}
                          {session.creditExchange}
                        </p>
                      </div>
                    </div>

                    {session.description && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">
                          Description:
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {session.description}
                        </p>
                      </div>
                    )}

                    {session.tags && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">
                          Tags:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {session.tags.split(",").map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleJoinRoom(session.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Join Room
                      </button>

                      {userId === session.senderId && !session.senderCompleted && (
                        <button
                          onClick={() => handleCompleteAsSender(session.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Complete as Sender
                        </button>
                      )}

                      {userId === session.receiverId && !session.receiverCompleted && (
                        <button
                          onClick={() => handleCompleteAsReceiver(session.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Complete as Receiver
                        </button>
                      )}

                      <button
                        onClick={() => handleCancelSession(session.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Cancel Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AcceptedSessionsPage;
