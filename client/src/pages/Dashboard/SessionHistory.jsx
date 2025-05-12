import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Sidebar from "../shared/SideBar";
import { format } from "date-fns";
import Swal from "sweetalert2";

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchSessionHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/sessions/getAllSessionsByUser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSessions(response.data.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch session history");
        setLoading(false);
      }
    };

    if (userId) {
      fetchSessionHistory();
    }
  }, [userId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCompletionStatus = (session) => {
    if (session.status !== "completed") return null;

    if (userId === session.senderId && userId === session.receiverId) {
      return "You completed both sides";
    }
    if (userId === session.senderId) {
      return `You marked as completed (${
        session.receiverCompleted
          ? "Receiver also completed"
          : "Waiting receiver"
      })`;
    }
    if (userId === session.receiverId) {
      return `You marked as completed (${
        session.senderCompleted ? "Sender also completed" : "Waiting sender"
      })`;
    }
    return null;
  };

  const handleRateClick = (session) => {
    const userIdToRate =
      userId === session.senderId ? session.receiverId : session.senderId;
    const userToRate =
      userId === session.senderId ? session.receiverName : session.senderName;
    const role = userId === session.senderId ? "Receiver" : "Sender";

    Swal.fire({
      title: `Rate ${userToRate}`,
      text: `How would you rate your ${role} (1-10)?`,
      input: "select",
      inputOptions: {
        1: "1 - Poor",
        2: "2",
        3: "3",
        4: "4",
        5: "5 - Average",
        6: "6",
        7: "7",
        8: "8 - Good",
        9: "9",
        10: "10 - Excellent",
      },
      inputPlaceholder: "Select a rating",
      showCancelButton: true,
      confirmButtonText: "Submit Rating",
      inputValidator: (value) => {
        if (!value) {
          return "You need to select a rating";
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // First update the user's rating
          await axios.put(
            `http://localhost:5000/users/updateUserRating/${userIdToRate}`,
            { rating: parseInt(result.value) },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          // Then update the session's rated status based on user role
          const endpoint =
            userId === session.senderId
              ? `http://localhost:5000/sessions/updateSenderRated/${session.id}`
              : `http://localhost:5000/sessions/updateRecieverRated/${session.id}`;

          await axios.put(
            endpoint,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          toast.success("Rating submitted successfully");

          // Refresh the session list to update the UI
          const response = await axios.get(
            `http://localhost:5000/sessions/getAllSessionsByUser/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setSessions(response.data.data);
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to submit rating"
          );
        }
      }
    });
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50 p-6 ms-64">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Session History
          </h1>

          {sessions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">No session history found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${
                    userId === session.senderId
                      ? "border-blue-500"
                      : "border-purple-500"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {session.topic}
                        </h3>
                        <p className="text-gray-600">
                          {userId === session.senderId
                            ? `Taught to ${session.receiverName}`
                            : `Learned from ${session.senderName}`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.creditExchange && (
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                            {session.creditExchange} Credits
                          </span>
                        )}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                            session.status
                          )}`}
                        >
                          {session.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Type:</span>{" "}
                          {session.senderWant === "teach"
                            ? "Teaching"
                            : "Learning"}{" "}
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
                          {format(new Date(session.startTime), "PPP")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Time:</span>{" "}
                          {format(new Date(session.startTime), "p")}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Duration:</span>{" "}
                          {session.duration} minutes
                        </p>
                        {getCompletionStatus(session) && (
                          <p className="text-sm text-green-600 mt-1">
                            {getCompletionStatus(session)}
                          </p>
                        )}
                      </div>
                    </div>

                    {session.description && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">
                          Description:
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {session.description}
                        </p>
                      </div>
                    )}

                    {session.tags && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">
                          Tags:
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
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

                    {session.status === "completed" &&
                      session.senderId !== session.receiverId && (
                        <div className="mt-4">
                          {(userId === session.senderId &&
                            !session.senderRated) ||
                          (userId === session.receiverId &&
                            !session.receiverRated) ? (
                            <button
                              onClick={() => handleRateClick(session)}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                              {userId === session.senderId
                                ? `Rate ${session.receiverName}`
                                : `Rate ${session.senderName}`}
                            </button>
                          ) : (
                            <p className="text-green-600 text-sm">
                              You have already rated this session
                            </p>
                          )}
                        </div>
                      )}
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

export default SessionHistory;
