import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTimes, faStar, faSpinner } from '@fortawesome/free-solid-svg-icons';
import api from '../config/api-client';

export default function ProfileManagement() {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState('https://via.placeholder.com/150');

  // Profile data
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    bio: '',
    expertise: [],
    credits: 0,
    rating: 0,
    date_of_birth: '',
    mobile_number: '',
    country: '',
    totalSessions: 0
  });

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    full_name: '',
    bio: '',
    date_of_birth: '',
    mobile_number: '',
    country: ''
  });
  
  const [newExpertise, setNewExpertise] = useState('');
  const [expertiseList, setExpertiseList] = useState([]);
  const [sessions, setSessions] = useState([]);
  
  // Security form
  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/profile');
        setProfile(response.data);
        setPersonalInfo({
          full_name: response.data.full_name,
          bio: response.data.bio || '',
          date_of_birth: response.data.date_of_birth || '',
          mobile_number: response.data.mobile_number || '',
          country: response.data.country || ''
        });
        setExpertiseList(response.data.expertise || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Fetch session history when that tab is active
  useEffect(() => {
    if (activeTab === 'history') {
      fetchSessionHistory();
    }
  }, [activeTab]);

  const fetchSessionHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/profile/sessions');
      setSessions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load session history');
      setLoading(false);
    }
  };

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

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleSecurityInfoChange = (e) => {
    const { name, value } = e.target;
    setSecurityInfo({ ...securityInfo, [name]: value });
  };

  const updatePersonalInfo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put('/api/profile/personal', personalInfo);
      setProfile({...profile, ...personalInfo});
      setLoading(false);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      setLoading(false);
    }
  };

  const updateExpertise = async () => {
    try {
      setLoading(true);
      await api.put('/api/profile/expertise', { expertise: expertiseList });
      setProfile({...profile, expertise: expertiseList});
      setLoading(false);
      alert('Expertise updated successfully');
    } catch (err) {
      console.error('Error updating expertise:', err);
      setError('Failed to update expertise');
      setLoading(false);
    }
  };

  const addExpertise = (e) => {
    e.preventDefault();
    if (newExpertise.trim() && !expertiseList.includes(newExpertise.trim())) {
      const updatedExpertise = [...expertiseList, newExpertise.trim()];
      setExpertiseList(updatedExpertise);
      setNewExpertise('');
    }
  };

  const removeExpertise = (index) => {
    setExpertiseList(expertiseList.filter((_, i) => i !== index));
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    // Password change API call would go here
    alert('Password update functionality to be implemented');
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
        <div className="relative group cursor-pointer">
          <img src={avatar} alt="Profile" className="w-32 h-32 rounded-full border-4 border-blue-500" />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAvatarChange} />
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
          <p className="text-gray-600 mb-4">{profile.email}</p>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profile.rating || 'N/A'}</div>
              <div className="text-gray-500 text-sm">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profile.totalSessions}</div>
              <div className="text-gray-500 text-sm">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profile.credits}</div>
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
            <form onSubmit={updatePersonalInfo} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  value={personalInfo.bio}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-3 border rounded h-32"
                />
              </div>
              <div>
                <label className="block mb-2">Date of Birth</label>
                <input 
                  type="date" 
                  name="date_of_birth"
                  value={personalInfo.date_of_birth} 
                  onChange={handlePersonalInfoChange}
                  className="w-full p-3 border rounded" 
                />
              </div>
              <div>
                <label className="block mb-2">Mobile Number</label>
                <input 
                  type="text" 
                  name="mobile_number"
                  value={personalInfo.mobile_number} 
                  onChange={handlePersonalInfoChange}
                  className="w-full p-3 border rounded" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Country</label>
                <input 
                  type="text" 
                  name="country"
                  value={personalInfo.country} 
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
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300">
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
            <form onSubmit={updatePassword} className="space-y-6">
              <div>
                <label className="block mb-2">Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword"
                  value={securityInfo.currentPassword}
                  onChange={handleSecurityInfoChange}
                  className="w-full p-3 border rounded" 
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
                />
              </div>
              <div>
                <label className="block mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={securityInfo.confirmPassword}
                  onChange={handleSecurityInfoChange}
                  className="w-full p-3 border rounded" 
                />
              </div>
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
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
              {expertiseList.map((skill, index) => (
                <div key={index} className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full flex items-center gap-2">
                  {skill}
                  <FontAwesomeIcon 
                    icon={faTimes} 
                    className="cursor-pointer hover:text-blue-700"
                    onClick={() => removeExpertise(index)}
                  />
                </div>
              ))}
            </div>
            <form onSubmit={addExpertise} className="flex gap-4 mb-6">
              <input
                type="text"
                value={newExpertise}
                onChange={(e) => setNewExpertise(e.target.value)}
                placeholder="Add new expertise area"
                className="flex-1 p-3 border rounded"
              />
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                Add Expertise
              </button>
            </form>
            <button 
              onClick={updateExpertise} 
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        )}

        {/* Session History */}
        {activeTab === 'history' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Session History</h2>
            {loading ? (
              <div className="text-center p-10">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
              </div>
            ) : sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="font-bold mb-2">{session.topic}</h3>
                      <div className="text-sm text-gray-500 mb-2">
                        {new Date(session.created_at).toLocaleDateString()} - {session.duration}
                      </div>
                      {session.rating && (
                        <div className="flex items-center gap-1 text-yellow-500">
                          <FontAwesomeIcon icon={faStar} />
                          <span>{session.rating}</span>
                        </div>
                      )}
                      <div className="text-sm">With: {session.other_user}</div>
                    </div>
                    <span className={`px-3 py-1 rounded ${
                      session.status === 'completed' ? 'bg-green-100 text-green-600' :
                      session.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
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