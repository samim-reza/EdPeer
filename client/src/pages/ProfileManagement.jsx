import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ProfileTab from "./ProfileManagement/ProfileTab";
import SecurityTab from "./ProfileManagement/SecurityTab";
import ExpertiseTab from "./ProfileManagement/ExpertiseTab";

export default function ProfileManagement() {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  // Profile data
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    bio: "",
    expertise: [],
    credits: 0,
    rating: 0,
    date_of_birth: "",
    mobile_number: "",
    country: "",
    totalSessions: 0,
  });

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    full_name: "",
    bio: "",
    date_of_birth: "",
    mobile_number: "",
    country: "",
  });

  const [sessions, setSessions] = useState([]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/users/profileData/${userId}`
        );
        const profileData = response.data.data;
        setProfile({
          full_name: profileData.full_name,
          email: profileData.email,
          bio: profileData.bio,
          expertise: profileData.expertise
            ? profileData.expertise.split(",")
            : [],
          credits: profileData.credit,
          rating: profileData.rating,
          date_of_birth: profileData.date_of_birth,
          mobile_number: profileData.mobile_number,
          country: profileData.country,
          totalSessions: profileData.total_session,
        });
        setPersonalInfo({
          full_name: profileData.full_name,
          bio: profileData.bio || "",
          date_of_birth: profileData.date_of_birth || "",
          mobile_number: profileData.mobile_number || "",
          country: profileData.country || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  // Fetch session history when that tab is active
  useEffect(() => {
    if (activeTab === "history") {
      fetchSessionHistory();
    }
  }, [activeTab]);

  const fetchSessionHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/sessions/user/${userId}`);
      setSessions(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load session history");
      setLoading(false);
    }
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const updatePersonalInfo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/users/updateUserProfileTab/${userId}`,
        personalInfo
      );
      setProfile({ ...profile, ...personalInfo });
      setLoading(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
      setLoading(false);
    }
  };

  if (loading && !profile.full_name) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );
  }

  if (error && !profile.full_name) {
    return (
      <div className="text-center text-red-500 p-10">
        {error} - Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="relative">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
          <p className="text-gray-600 mb-4">{profile.email}</p>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {profile.rating || "N/A"}
              </div>
              <div className="text-gray-500 text-sm">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {profile.totalSessions}
              </div>
              <div className="text-gray-500 text-sm">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {profile.credits}
              </div>
              <div className="text-gray-500 text-sm">Credits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b mb-8">
        {["personal", "security", "expertise", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {/* Personal Info */}
        {activeTab === "personal" && (
          <ProfileTab
            profile={profile}
            loading={loading}
            personalInfo={personalInfo}
            handlePersonalInfoChange={handlePersonalInfoChange}
            updatePersonalInfo={updatePersonalInfo}
          />
        )}

        {/* Security */}
        {activeTab === "security" && <SecurityTab />}

        {/* Expertise */}
        {activeTab === "expertise" && (
          <ExpertiseTab
            profile={profile}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
            setProfile={setProfile}
          />
        )}

        {/* Session History */}
        {activeTab === "history" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Session History</h2>
            {loading ? (
              <div className="text-center p-10">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
              </div>
            ) : sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold mb-2">{session.topic}</h3>
                      <div className="text-sm text-gray-500 mb-2">
                        {new Date(session.created_at).toLocaleDateString()} -{" "}
                        {session.duration}
                      </div>
                      {session.rating && (
                        <div className="flex items-center gap-1 text-yellow-500">
                          <FontAwesomeIcon icon={faStar} />
                          <span>{session.rating}</span>
                        </div>
                      )}
                      <div className="text-sm">With: {session.other_user}</div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded ${
                        session.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : session.status === "scheduled"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {session.status.charAt(0).toUpperCase() +
                        session.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No session history found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
