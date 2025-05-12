import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2";

const AllSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionType, setSessionType] = useState("all");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [searchTerm, sessionType, sessions]);

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

  const filterSessions = () => {
    let result = [...sessions];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (session) =>
          session.topic?.toLowerCase().includes(term) ||
          (session.exchangeTopic &&
            session.exchangeTopic.toLowerCase().includes(term)) ||
          (session.tags && session.tags.toLowerCase().includes(term))
      );
    }

    // Apply type filter
    if (sessionType !== "all") {
      result = result.filter(
        (session) => session.senderWant?.toLowerCase() === sessionType
      );
    }

    setFilteredSessions(result);
  };

  const handleAccept = async (sessionId) => {
    try {
      const sessionToAccept = sessions.find(
        (session) => session.id === sessionId
      );

      // Check if it's a teaching session with credit exchange
      if (
        sessionToAccept.senderWant === "teach" &&
        sessionToAccept.creditExchange
      ) {
        // Get user's current balance
        const balanceResponse = await axios.get(
          `http://localhost:5000/users/getUserBalance/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const userBalance = balanceResponse.data.data;

        console.log("User balance:", userBalance);

        if (userBalance < sessionToAccept.creditExchange) {
          await Swal.fire({
            title: "Insufficient Balance",
            text: `You need ${sessionToAccept.creditExchange} credits to accept this session, but you only have ${userBalance}.`,
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }
      }

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

  const handleViewDetails = (sessionId) => {
    navigate(`/sessions/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Available Sessions
        </h1>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by topic, exchange, or tags..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSessionType("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sessionType === "all"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Sessions
              </button>
              <button
                onClick={() => setSessionType("learn")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sessionType === "learn"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Want to Learn
              </button>
              <button
                onClick={() => setSessionType("teach")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sessionType === "teach"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Want to Teach
              </button>
            </div>
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No sessions found
            </h3>
            <p className="mt-1 text-gray-500">
              {searchTerm
                ? "Try adjusting your search or filter criteria"
                : "Check back later for new sessions"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  {/* Session Header with sender name */}
                  <div className="flex justify-between items-start">
                    <div>
                      {session.senderName && (
                        <p className="text-sm text-gray-500 mb-1">
                          By {session.senderName}
                        </p>
                      )}
                      <h3 className="text-xl font-bold text-gray-800 capitalize">
                        {session.topic}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            session.senderWant === "teach"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {session.senderWant === "teach"
                            ? "Want to Teach"
                            : "Want to Learn"}
                        </span>
                      </div>
                    </div>
                    {session.creditExchange && (
                      <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-lg font-bold">
                        {session.creditExchange} Credits
                      </div>
                    )}
                  </div>

                  {/* Session Details */}
                  <div className="mt-4 space-y-2">
                    {!session.creditExchange && session.exchangeTopic && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                          />
                        </svg>
                        Exchange for: {session.exchangeTopic}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(session.startTime).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Duration: {session.duration} minutes
                    </div>

                    {session.description && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {session.description}
                        </p>
                      </div>
                    )}

                    {session.tags && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {session.tags.split(",").map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-2">
                    <a
                      href={`/userProfile/${session.senderId}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Sender Profile
                    </a>
                    {session.status === "pending" && (
                      <button
                        onClick={() => handleAccept(session.id)}
                        className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Accept
                      </button>
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
