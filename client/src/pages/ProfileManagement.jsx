import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUser, faCog, faHistory, faWallet, faSignOutAlt, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';

export default function ProfileManagement() {
  const [activeTab, setActiveTab] = useState('personal');
  const [expertise, setExpertise] = useState(['Web Development', 'JavaScript', 'Database Systems']);
  const [newExpertise, setNewExpertise] = useState('');
  const [avatar, setAvatar] = useState('https://via.placeholder.com/150');

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

  const addExpertise = (e) => {
    e.preventDefault();
    if (newExpertise.trim()) {
      setExpertise([...expertise, newExpertise.trim()]);
      setNewExpertise('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="relative group cursor-pointer">
          <img src={avatar} alt="Profile" className="w-32 h-32 rounded-full border-4 border-blue-500" />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />
            <input type="file" className="hidden" onChange={handleAvatarChange} />
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">Ismatul Islam Pranto</h1>
          <p className="text-gray-600 mb-4">Computer Science Student at Green University</p>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4.8</div>
              <div className="text-gray-500 text-sm">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-gray-500 text-sm">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">850</div>
              <div className="text-gray-500 text-sm">Credits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b mb-8">
        {['personal', 'security', 'expertise', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 capitalize ${
              activeTab === tab 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {/* Personal Info */}
        {activeTab === 'personal' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">First Name</label>
                <input type="text" defaultValue="Ismatul" className="w-full p-3 border rounded" />
              </div>
              <div>
                <label className="block mb-2">Last Name</label>
                <input type="text" defaultValue="Islam" className="w-full p-3 border rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Bio</label>
                <textarea 
                  defaultValue="Computer Science student passionate about web development and AI"
                  className="w-full p-3 border rounded h-32"
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                  Save Changes
                </button>
                <button className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
            <div className="bg-yellow-100 p-4 rounded-lg flex items-center gap-4 mb-6">
              <FontAwesomeIcon icon={faCog} className="text-yellow-600" />
              Last password change: 3 days ago
            </div>
            <form className="space-y-6">
              <div>
                <label className="block mb-2">Current Password</label>
                <input type="password" className="w-full p-3 border rounded" />
              </div>
              <div>
                <label className="block mb-2">New Password</label>
                <input type="password" className="w-full p-3 border rounded" />
              </div>
              <div>
                <label className="block mb-2">Confirm New Password</label>
                <input type="password" className="w-full p-3 border rounded" />
              </div>
              <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                Update Password
              </button>
            </form>
          </div>
        )}

        {/* Expertise */}
        {activeTab === 'expertise' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">My Expertise Areas</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {expertise.map((skill, index) => (
                <div key={index} className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full flex items-center gap-2">
                  {skill}
                  <FontAwesomeIcon 
                    icon={faTimes} 
                    className="cursor-pointer hover:text-blue-700"
                    onClick={() => setExpertise(expertise.filter((_, i) => i !== index))}
                  />
                </div>
              ))}
            </div>
            <form onSubmit={addExpertise} className="flex gap-4">
              <input
                type="text"
                value={newExpertise}
                onChange={(e) => setNewExpertise(e.target.value)}
                placeholder="Add new expertise area"
                className="flex-1 p-3 border rounded"
              />
              <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                Add Expertise
              </button>
            </form>
          </div>
        )}

        {/* Session History */}
        {activeTab === 'history' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Session History</h2>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-bold mb-2">JavaScript Promises</h3>
                    <div className="text-sm text-gray-500 mb-2">September 15, 2024 - 45 mins</div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FontAwesomeIcon icon={faStar} />
                      <span>4.5</span>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded">Completed</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}