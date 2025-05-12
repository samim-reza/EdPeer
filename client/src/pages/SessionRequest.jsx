import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUser, faCheck } from "@fortawesome/free-solid-svg-icons";
import api from "../config/api-client";
import RequestHelpPage from "./RequestHelpPage";
import MySessionsPage from "./MySessionsPage";

export default function FindSessionsPage() {
  const [activeTab, setActiveTab] = useState("request-tab");
  const [availableSessions, setAvailableSessions] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === "available-tab") {
      fetchAvailableSessions();
    }
  }, [activeTab]);

  const fetchAvailableSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/sessions/available", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAvailableSessions(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch available sessions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPotentialMatches = async (sessionId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/session/matches/${sessionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPotentialMatches(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch potential matches");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const acceptSession = async (sessionId) => {
    try {
      setLoading(true);
      await api.put(
        `/api/session/accept/${sessionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("Session accepted successfully!");
      fetchAvailableSessions();
      setError(null);
    } catch (err) {
      setError("Failed to accept session");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionCreated = (sessionId) => {
    fetchPotentialMatches(sessionId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Find Help & Request Sessions</h1>
      <p className="text-gray-600 mb-8">
        Request help with specific topics and get matched with qualified peers.
      </p>

      {/* Tabs */}
      <div className="flex border-b mb-8">
        {[
          { id: "request-tab", name: "Request Help" },
          { id: "my-sessions-tab", name: "My Sessions" },
          { id: "available-tab", name: "Available Sessions" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Request Help Tab */}
      {activeTab === "request-tab" && (
        <RequestHelpPage onSessionCreated={handleSessionCreated} />
      )}

      {activeTab === "my-sessions-tab" && (
        <MySessionsPage />
      )}

      {/* Available Sessions Tab */}
      {activeTab === "available-tab" && (
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Available Sessions</h2>
          {loading && (
            <p className="text-gray-600">Loading available sessions...</p>
          )}
          {!loading && availableSessions.length === 0 && (
            <p className="text-gray-600">No available sessions found.</p>
          )}
          {availableSessions.length > 0 && (
            <div className="space-y-4">
              {availableSessions.map((session) => (
                <div key={session.id} className="border p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">{session.topic}</h3>
                    <span className="font-medium text-blue-500">
                      {session.cost} Credits
                    </span>
                  </div>
                  <div className="flex flex-wrap md:flex-nowrap justify-between gap-6">
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        Student:{" "}
                        <span className="font-medium">
                          {session.student_name}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Duration:{" "}
                        <span className="font-medium">
                          {session.duration} minutes
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Created:{" "}
                        <span className="font-medium">
                          {new Date(session.created_at).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => acceptSession(session.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        Accept Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Matching Results */}
      {potentialMatches.length > 0 && (
        <div className="bg-blue-50 p-8 rounded-xl shadow mt-8">
          <h2 className="text-2xl font-bold mb-6">Potential Matches</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {potentialMatches.map((match, i) => (
              <div key={i} className="bg-white p-6 rounded-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-blue-500 text-2xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{match.full_name}</h3>
                    <div className="flex items-center gap-2 text-yellow-500">
                      {[...Array(5)].map((_, s) => (
                        <FontAwesomeIcon
                          key={s}
                          icon={faStar}
                          className={
                            s < Math.floor(match.avg_rating)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="text-gray-600">
                        ({match.total_sessions} sessions)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-bold">{match.total_sessions}</div>
                      <div className="text-gray-600 text-sm">Sessions</div>
                    </div>
                    <div>
                      <div className="font-bold">{match.avg_rating}</div>
                      <div className="text-gray-600 text-sm">Rating</div>
                    </div>
                    <div>
                      <div className="font-bold">{match.avg_response_time}</div>
                      <div className="text-gray-600 text-sm">Response</div>
                    </div>
                  </div>
                  <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Send Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
