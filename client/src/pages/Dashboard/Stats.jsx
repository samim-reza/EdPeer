import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadset,
  faCheckCircle,
  faCoins,
  faStar,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function StatsGrid() {
  const [stats, setStats] = useState([]);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    rating: "0",
    totalSessions: "0",
    credits: "0",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const fetchUserBalance = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/getUserBalance/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.data;
    } catch (err) {
      console.error("Failed to fetch user balance:", err);
      return "0"; // Return default value if fetch fails
    }
  };

  const fetchUserRating = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/getUserRating/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.data.toString() || "0";
    } catch (err) {
      console.error("Failed to fetch user rating:", err);
      return "0"; // Return default value if fetch fails
    }
  };

  const handleFileUpload = async (e) => {
    // ... (keep existing file upload logic) ...
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) {
          throw new Error("User not authenticated");
        }

        // Fetch user data in parallel
        const [userBalance, userRating] = await Promise.all([
          fetchUserBalance(user.id),
          fetchUserRating(user.id),
        ]);

        // Set profile data
        setProfile({
          full_name: user.fullName || "User",
          email: user.email || "",
          rating: userRating,
          credits: userBalance.toString(),
          profilePicture:
            user.profilePicture ||
            "https://img.freepik.com/premium-photo/3d-avatar-cartoon-character_113255-103130.jpg",
        });

        const baseUrl = "http://localhost:5000";
        const userId = user.id;

        // Make parallel requests for other stats
        const [activeSessionsRes, completedSessionsRes] = await Promise.all([
          axios.get(`${baseUrl}/sessions/noOfAcceptedSessions/${userId}`),
          axios.get(`${baseUrl}/sessions/noOfCompletedSessions/${userId}`),
        ]);

        // Update profile with total sessions
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
            icon: faCoins,
            title: "Available Credits",
            value: userBalance.toString(),
            color: "purple",
          },
          {
            icon: faStar,
            title: "Rating",
            value: userRating,
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

        // Set default values when error occurs
        const user = JSON.parse(localStorage.getItem("user")) || {};
        setProfile({
          full_name: user.fullName || "User",
          email: user.email || "",
          rating: "0",
          totalSessions: "0",
          credits: "0",
          profilePicture:
            user.profilePicture ||
            "https://img.freepik.com/premium-photo/3d-avatar-cartoon-character_113255-103130.jpg",
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
            icon: faCoins,
            title: "Available Credits",
            value: "0",
            color: "purple",
          },
          { icon: faStar, title: "Rating", value: "0", color: "yellow" },
        ]);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow-sm animate-pulse"
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
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="relative group">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
          />
          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors group-hover:opacity-100 opacity-0"
          >
            <FontAwesomeIcon icon={faCamera} />
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        <div className="text-center md:text-left">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ textTransform: "capitalize" }}
          >
            {profile.full_name}
          </h1>
          <p className="text-gray-600 mb-4">{profile.email}</p>
          <div className="flex items-center gap-4">
            <p className="text-lg font-semibold text-purple-600">
              Credits: {profile.credits}
            </p>
            <p className="text-lg font-semibold text-yellow-600">
              Rating: {profile.rating}
            </p>
          </div>
          {uploadError && (
            <p className="text-red-500 text-sm mt-2">{uploadError}</p>
          )}
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  stat.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : stat.color === "green"
                    ? "bg-green-100 text-green-600"
                    : stat.color === "purple"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                <FontAwesomeIcon icon={stat.icon} className="text-xl" />
              </div>
            </div>
          </div>
        ))}
        {error && (
          <div className="col-span-4 p-4 bg-red-50 text-red-600 rounded-lg">
            <p>{error}</p>
          </div>
        )}
      </div>
    </>
  );
}
