import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadset,
  faCheckCircle,
  faStar,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StatsGrid() {
  const { userId: otherUserId } = useParams();
  const [stats, setStats] = useState([]);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    rating: "0",
    totalSessions: "0",
    profilePicture: "",
    id: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser?.id) {
          throw new Error("User not authenticated");
        }

        // Fetch the other user's profile data
        const otherUserResponse = await axios.get(
          `http://localhost:5000/users/profileData/${otherUserId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const otherUser = otherUserResponse.data.data;

        setProfile({
          full_name: otherUser.full_name || "User",
          email: otherUser.email || "",
          rating: otherUser.rating?.toString() || "0",
          profilePicture:
            otherUser.profilePicture ||
            "https://img.freepik.com/premium-photo/3d-avatar-cartoon-character_113255-103130.jpg",
          id: otherUser.id,
        });

        const baseUrl = "http://localhost:5000";

        // Fetch stats for the other user
        const [activeSessionsRes, completedSessionsRes] = await Promise.all([
          axios.get(`${baseUrl}/sessions/noOfAcceptedSessions/${otherUserId}`),
          axios.get(`${baseUrl}/sessions/noOfCompletedSessions/${otherUserId}`),
        ]);

        setProfile((prev) => ({
          ...prev,
          totalSessions: completedSessionsRes.data.data?.toString() || "0",
        }));

        setStats([
          {
            icon: faHeadset,
            title: "Active Sessions",
            value: activeSessionsRes.data.data?.toString() || "0",
            color: "blue",
          },
          {
            icon: faCheckCircle,
            title: "Completed Sessions",
            value: completedSessionsRes.data.data?.toString() || "0",
            color: "green",
          },
          {
            icon: faStar,
            title: "Rating",
            value: otherUser.rating?.toString() || "0",
            color: "yellow",
          },
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load statistics"
        );
        setLoading(false);

        setProfile({
          full_name: "User",
          email: "",
          rating: "0",
          totalSessions: "0",
          profilePicture:
            "https://img.freepik.com/premium-photo/3d-avatar-cartoon-character_113255-103130.jpg",
          id: "",
        });

        setStats([
          {
            icon: faHeadset,
            title: "Active Sessions",
            value: "0",
            color: "blue",
          },
          {
            icon: faCheckCircle,
            title: "Completed Sessions",
            value: "0",
            color: "green",
          },
          {
            icon: faStar,
            title: "Rating",
            value: "0",
            color: "yellow",
          },
        ]);
      }
    };

    fetchStats();
  }, [otherUserId]);

  const handleSendMessage = () => {
    if (!profile.email) {
      alert("This user doesn't have an email address available");
      return;
    }

    // Open default email client with new email to the user
    window.location.href = `mailto:${profile.email}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-sm animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 mt-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
            />
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1
                  className="text-3xl font-bold mb-2 text-gray-800"
                  style={{ textTransform: "capitalize" }}
                >
                  {profile.full_name}
                </h1>
                <p className="text-gray-600 mb-4">{profile.email}</p>
              </div>
              <button
                onClick={handleSendMessage}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faEnvelope} />
                Send Email
              </button>
            </div>
            <p className="text-gray-500">
              <span className="font-medium">{profile.totalSessions}</span> total
              sessions
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  stat.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : stat.color === "green"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                <FontAwesomeIcon icon={stat.icon} className="text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
