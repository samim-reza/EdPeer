import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faUser,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import api from "../config/api-client";

export default function MySessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    fetchUserSessions();
  }, []);

  const fetchUserSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/sessions/getSingleUserSession/${userId}`
      );
      setSessions(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch your sessions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async (sessionId) => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/sessions/changeStatus/${sessionId}`,
        {
          status: "cancelled",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Session cancelled successfully!");
      fetchUserSessions();
      setError(null);
    } catch (err) {
      setError("Failed to cancel session");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async (sessionId) => {
    try {
      setLoading(true);
      await axios.put(
        `/sessions/complete/${sessionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Session marked as completed!");
      fetchUserSessions();
      setError(null);
    } catch (err) {
      setError("Failed to complete session");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-600",
      active: "bg-blue-100 text-blue-600",
      completed: "bg-green-100 text-green-600",
      cancelled: "bg-red-100 text-red-600",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm ${
          statusClasses[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">My Sessions</h1>
      <p className="text-gray-600 mb-8">
        View and manage your current and past tutoring sessions.
      </p>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Your Sessions</h2>
        {loading && <p className="text-gray-600">Loading sessions...</p>}
        {!loading && sessions.length === 0 && (
          <p className="text-gray-600">No sessions found.</p>
        )}
        {sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session) => {
              const isSender = session.senderId == userId;
              const isTeaching = session.senderWant === "Teach";

              return (
                <div key={session.id} className="border p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">{session.title}</h3>
                    {getStatusBadge(session.status)}
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap justify-between gap-6">
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        {isSender ? "You are" : "User is"} looking to:{" "}
                        <span className="font-medium">
                          {isTeaching ? "Teach" : "Learn"} {session.topic}
                        </span>
                      </p>

                      {session.exchangeTopic && (
                        <p className="text-gray-600">
                          In exchange for:{" "}
                          <span className="font-medium">
                            {isTeaching ? "Learning" : "Teaching"}{" "}
                            {session.exchangeTopic}
                          </span>
                        </p>
                      )}

                      <p className="text-gray-600">
                        Category:{" "}
                        <span className="font-medium">{session.category}</span>
                      </p>

                      <p className="text-gray-600">
                        Scheduled:{" "}
                        <span className="font-medium">
                          {new Date(session.startTime).toLocaleString()}
                        </span>
                      </p>

                      <p className="text-gray-600">
                        Duration:{" "}
                        <span className="font-medium">
                          {session.duration} minutes
                        </span>
                      </p>

                      {session.description && (
                        <p className="text-gray-600">
                          Description:{" "}
                          <span className="font-medium">
                            {session.description}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="block text-blue-500 font-bold text-xl mb-4">
                        {session.creditExchange} Credits
                      </span>

                      <div className="flex gap-2 mt-3">
                        {session.status === "pending" && isSender && (
                          <button
                            onClick={() => cancelSession(session.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                          >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Cancel
                          </button>
                        )}

                        {session.status === "active" && (
                          <>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                              Join Session
                            </button>
                            <button
                              onClick={() => completeSession(session.id)}
                              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                            >
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="mr-2"
                              />
                              Complete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {session.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {session.tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
