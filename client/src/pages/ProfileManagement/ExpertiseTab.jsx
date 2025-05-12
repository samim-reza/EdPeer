import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function ExpertiseTab({
  profile,
  loading,
  setLoading,
  setError,
  setProfile,
}) {
  const [newExpertise, setNewExpertise] = useState("");
  const [expertiseList, setExpertiseList] = useState([]);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  // Initialize expertise list from profile
  useEffect(() => {
    if (profile.expertise) {
      // Convert expertise string to array if it's a string
      const expertiseArray =
        typeof profile.expertise === "string"
          ? profile.expertise.split(",")
          : profile.expertise;
      setExpertiseList(expertiseArray);
    }
  }, [profile.expertise]);

  const updateExpertise = async () => {
    try {
      setLoading(true);
      // Convert array to comma-separated string before sending
      const expertiseString = expertiseList.join(",");

      console.log("Expertise String:", expertiseString);

      await axios.put(`http://localhost:5000/users/updateExpertise/${userId}`, {
        expertise: expertiseString,
      });

      // Update profile with the new expertise array
      setProfile({
        ...profile,
        expertise: expertiseList,
      });

      setLoading(false);
      alert("Expertise updated successfully");
    } catch (err) {
      console.error("Error updating expertise:", err);
      setError("Failed to update expertise");
      setLoading(false);
    }
  };

  const addExpertise = (e) => {
    e.preventDefault();
    const trimmedExpertise = newExpertise.trim();

    if (trimmedExpertise && !expertiseList.includes(trimmedExpertise)) {
      // Add new expertise to the array
      setExpertiseList([...expertiseList, trimmedExpertise]);
      setNewExpertise("");
    }
  };

  const removeExpertise = (indexToRemove) => {
    // Filter out the expertise at the given index
    setExpertiseList(
      expertiseList.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">My Expertise Areas</h2>

      {/* Display current expertise as tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {expertiseList.map((skill, index) => (
          <div
            key={index}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full flex items-center gap-2"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeExpertise(index)}
              className="text-blue-600 hover:text-blue-700 focus:outline-none"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        ))}
      </div>

      {/* Form to add new expertise */}
      <form onSubmit={addExpertise} className="flex gap-4 mb-6">
        <input
          type="text"
          value={newExpertise}
          onChange={(e) => setNewExpertise(e.target.value)}
          placeholder="Add new expertise area"
          className="flex-1 p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          disabled={!newExpertise.trim()}
        >
          Add Expertise
        </button>
      </form>

      {/* Save button */}
      <button
        onClick={updateExpertise}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors"
        disabled={loading || expertiseList.length === 0}
      >
        {loading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            Saving...
          </>
        ) : (
          "Save All Changes"
        )}
      </button>
    </div>
  );
}
