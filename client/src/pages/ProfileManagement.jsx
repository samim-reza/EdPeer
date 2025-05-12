import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ProfileTab from "./ProfileManagement/ProfileTab";
import SecurityTab from "./ProfileManagement/SecurityTab";
import ExpertiseTab from "./ProfileManagement/ExpertiseTab";
import Sidebar from "./shared/SideBar";

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
    profilePicture: "",
  });

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    full_name: "",
    bio: "",
    date_of_birth: "",
    mobile_number: "",
    country: "",
    profilePicture: "",
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
          profilePicture: profileData.profilePicture,
        });
        setPersonalInfo({
          full_name: profileData.full_name,
          bio: profileData.bio || "",
          date_of_birth: profileData.date_of_birth || "",
          mobile_number: profileData.mobile_number || "",
          country: profileData.country || "",
          profilePicture: profileData.profilePicture || "",
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

      // ✅ Update only the profile picture in localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      userData.profilePicture = personalInfo.profilePicture;
      localStorage.setItem("user", JSON.stringify(userData));

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
    <>
      <Sidebar />
      <div className="max-w-6xl mx-auto p-6 ms-64">
        {/* Profile Header */}

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 border-b mb-8 mt-12">
          {["personal", "security", "expertise"].map((tab) => (
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

          
        </div>
      </div>
    </>
  );
}
