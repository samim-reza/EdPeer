import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function SecurityTab() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  const [securityInfo, setSecurityInfo] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSecurityInfoChange = (e) => {
    const { name, value } = e.target;
    setSecurityInfo({ ...securityInfo, [name]: value });
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (
      !securityInfo.oldPassword ||
      !securityInfo.newPassword ||
      !securityInfo.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (securityInfo.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      console.log("Updating password for user ID:", userId);
        console.log("Security Info:", securityInfo);
      const response = await axios.put(
        `http://localhost:5000/users/updatePassword/${userId}`,
        {
          currentPassword: securityInfo.oldPassword,
          newPassword: securityInfo.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from server:", response.data);

      if (response.data.success) {
        setSuccess("Password updated successfully");
        setSecurityInfo({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(response.data.message || "Failed to update password");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={updatePassword} className="space-y-6">
        <div>
          <label className="block mb-2">Current Password</label>
          <input
            type="password"
            name="oldPassword"
            value={securityInfo.oldPassword}
            onChange={handleSecurityInfoChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={securityInfo.newPassword}
            onChange={handleSecurityInfoChange}
            className="w-full p-3 border rounded"
            required
            minLength="8"
          />
          <p className="text-sm text-gray-500 mt-1">
            Password must be at least 8 characters long
          </p>
        </div>
        <div>
          <label className="block mb-2">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={securityInfo.confirmPassword}
            onChange={handleSecurityInfoChange}
            className="w-full p-3 border rounded"
            required
            minLength="8"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
}
