import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function ProfileTab({
  profile,
  loading,
  personalInfo,
  handlePersonalInfoChange,
  updatePersonalInfo,
}) {
  const [avatar, setAvatar] = useState("https://via.placeholder.com/150");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert the date string to YYYY-MM-DD format for the date input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      <form
        onSubmit={updatePersonalInfo}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="md:col-span-2">
          <label className="block mb-2">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={personalInfo.full_name}
            onChange={handlePersonalInfoChange}
            className="w-full p-3 border rounded"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2">Bio</label>
          <textarea
            name="bio"
            value={personalInfo.bio || ""}
            onChange={handlePersonalInfoChange}
            className="w-full p-3 border rounded h-32"
          />
        </div>
        <div>
          <label className="block mb-2">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formatDateForInput(personalInfo.date_of_birth)}
            onChange={handlePersonalInfoChange}
            className="w-full p-3 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Mobile Number</label>
          <input
            type="text"
            name="mobile_number"
            value={personalInfo.mobile_number || ""}
            onChange={handlePersonalInfoChange}
            className="w-full p-3 border rounded"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2">Country</label>
          <input
            type="text"
            name="country"
            value={personalInfo.country || ""}
            onChange={handlePersonalInfoChange}
            className="w-full p-3 border rounded"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2">Profile Picture Link</label>
          <input
            type="text"
            name="profilePicture"
            value={personalInfo.profilePicture || ""}
            onChange={handlePersonalInfoChange}
            className="w-full p-3 border rounded"
          />
        </div>
        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
