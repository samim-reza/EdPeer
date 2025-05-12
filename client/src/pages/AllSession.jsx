import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import axios from "axios";

const AllSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/sessions/getAvailableSessions",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSessions(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch sessions");
      setLoading(false);
      toast.error("Failed to fetch sessions");
    }
  };

  const handleAccept = async (sessionId) => {
    try {
      await axios.put(
        `http://localhost:5000/sessions/acceptSession/${sessionId}`,
        { receiverId: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSessions(
        sessions.map((session) =>
          session.id === sessionId
            ? { ...session, status: "accepted", receiverId: userId }
            : session
        )
      );
      toast.success("Session accepted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept session");
    }
  };

  // ... rest of the component remains the same ...
  const handleReject = async (sessionId) => {
    try {
      await axios.put(
        `http://localhost:5000/sessions/reject/${sessionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSessions(
        sessions.map((session) =>
          session.id === sessionId
            ? { ...session, status: "rejected" }
            : session
        )
      );
      toast.success("Session rejected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject session");
    }
  };

  const handleViewDetails = (sessionId) => {
    navigate(`/sessions/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Available Sessions</h1>
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
          <h1 className="text-2xl font-bold mb-6">Available Sessions</h1>
          <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Available Sessions</h1>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No available sessions at the moment.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{session.title}</h3>
                      <p className="text-gray-600">{session.category}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        session.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : session.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : session.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">From:</span>{" "}
                      {session.senderName}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Type:</span>{" "}
                      {session.senderWant === "Teach" ? "Teaching" : "Learning"}{" "}
                      {session.topic}
                    </p>
                    {session.exchangeTopic && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Exchange for:</span>{" "}
                        {session.exchangeTopic}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(session.startTime).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Duration:</span>{" "}
                      {session.duration} minutes
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Credits:</span>{" "}
                      {session.creditExchange}
                    </p>
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
                      <p className="text-sm font-medium text-gray-700">Tags:</p>
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

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(session.id)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      View Details
                    </button>
                    {session.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAccept(session.id)}
                          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(session.id)}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSessions;
