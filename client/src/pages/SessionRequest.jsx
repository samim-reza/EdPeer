import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faBolt, faExclamationCircle, faCoins, faUser, faClock, faCheck, faSearch } from '@fortawesome/free-solid-svg-icons';
import api from '../config/api-client';

export default function SessionRequest() {
  const [activeTab, setActiveTab] = useState('request-tab');
  const [urgency, setUrgency] = useState('priority');
  const [duration, setDuration] = useState(30);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Programming');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [tags, setTags] = useState(['JavaScript']);
  const [newTag, setNewTag] = useState('');
  const [activeSessions, setActiveSessions] = useState([]);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate cost based on urgency
  const costMap = { standard: 10, priority: 20, urgent: 30 };
  const cost = costMap[urgency] || 10;

  useEffect(() => {
    if (activeTab === 'active-tab') {
      fetchActiveSessions();
    } else if (activeTab === 'available-tab') {
      fetchAvailableSessions();
    }
  }, [activeTab]);

  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/sessions/active', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setActiveSessions(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch active sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/sessions/available', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAvailableSessions(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch available sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPotentialMatches = async (sessionId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/session/matches/${sessionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPotentialMatches(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch potential matches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createSessionRequest = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post(
        '/api/session/create',
        { topic, description, urgency, duration, tags },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      alert('Session request created successfully!');
      fetchPotentialMatches(response.data.sessionId);
      setError(null);
    } catch (err) {
      setError('Failed to create session request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const acceptSession = async (sessionId) => {
    try {
      setLoading(true);
      await api.put(
        `/api/session/accept/${sessionId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      alert('Session accepted successfully!');
      fetchAvailableSessions();
      setError(null);
    } catch (err) {
      setError('Failed to accept session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Find Help & Request Sessions</h1>
      <p className="text-gray-600 mb-8">Request help with specific topics and get matched with qualified peers.</p>

      {/* Tabs */}
      <div className="flex border-b mb-8">
        {[
          { id: 'request-tab', name: 'Request Help' },
          { id: 'active-tab', name: 'Active Sessions' },
          { id: 'available-tab', name: 'Available Sessions' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Request Help Tab */}
      {activeTab === 'request-tab' && (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">Create New Help Request</h2>
            <form className="space-y-8" onSubmit={createSessionRequest}>
              <div className="space-y-4">
                <label className="block text-lg font-medium">Session Title</label>
                <input
                  type="text"
                  placeholder="e.g., Help with JavaScript Promises"
                  className="w-full p-4 border rounded-lg"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-lg font-medium">Subject Category</label>
                  <select 
                    className="w-full p-4 border rounded-lg"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Programming</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="block text-lg font-medium">Difficulty Level</label>
                  <select 
                    className="w-full p-4 border rounded-lg"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-medium">Session Description</label>
                <textarea
                  className="w-full p-4 border rounded-lg h-32"
                  placeholder="Describe the specific problem or concept you need help with."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-medium">Tags</label>
                <div className="flex flex-wrap gap-2 p-4 border rounded-lg">
                  {tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center gap-2">
                      {tag}
                      <button type="button" onClick={() => removeTag(index)} className="hover:text-blue-700">
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={addTag}
                    placeholder="Add tag..."
                    className="flex-1 p-1 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-medium">Session Duration</label>
                <select 
                  className="w-full p-4 border rounded-lg"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              <div className="space-y-6">
                <label className="block text-lg font-medium">Session Urgency</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {['standard', 'priority', 'urgent'].map((type) => (
                    <div
                      key={type}
                      onClick={() => setUrgency(type)}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        urgency === type 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-center">
                        <FontAwesomeIcon 
                          icon={type === 'urgent' ? faExclamationCircle : type === 'priority' ? faBolt : faClock}
                          className={`text-3xl mb-4 ${
                            urgency === type ? 'text-blue-500' : 'text-gray-400'
                          }`}
                        />
                        <h3 className="text-xl font-bold mb-2 capitalize">{type}</h3>
                        <p className="text-gray-600 mb-2">
                          {type === 'standard' && 'Match within 24 hours'}
                          {type === 'priority' && 'Match within 6 hours'}
                          {type === 'urgent' && 'Match ASAP (1 hour)'}
                        </p>
                        <div className="text-lg font-bold text-blue-500">
                          {costMap[type]} Credits
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <button 
                  type="submit"
                  className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Submit Request (Total: ${cost} Credits)`}
                </button>
              </div>
            </form>
          </div>

          {/* Matching Results */}
          {potentialMatches.length > 0 && (
            <div className="bg-blue-50 p-8 rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-6">Potential Matches</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {potentialMatches.map((match, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-blue-500 text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{match.full_name}</h3>
                        <div className="flex items-center gap-2 text-yellow-500">
                          {[...Array(5)].map((_, s) => (
                            <FontAwesomeIcon key={s} icon={faStar} className={s < Math.floor(match.avg_rating) ? "text-yellow-500" : "text-gray-300"} />
                          ))}
                          <span className="text-gray-600">({match.total_sessions} sessions)</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="font-bold">{match.total_sessions}</div>
                          <div className="text-gray-600 text-sm">Sessions</div>
                        </div>
                        <div>
                          <div className="font-bold">{match.avg_rating}</div>
                          <div className="text-gray-600 text-sm">Rating</div>
                        </div>
                        <div>
                          <div className="font-bold">{match.avg_response_time}</div>
                          <div className="text-gray-600 text-sm">Response</div>
                        </div>
                      </div>
                      <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        Send Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Sessions Tab */}
      {activeTab === 'active-tab' && (
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Your Active Sessions</h2>
          {loading && <p className="text-gray-600">Loading sessions...</p>}
          {!loading && activeSessions.length === 0 && (
            <p className="text-gray-600">No active sessions found.</p>
          )}
          {activeSessions.length > 0 && (
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="border p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">{session.topic}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm 
                      ${session.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap md:flex-nowrap justify-between gap-6">
                    <div className="space-y-2">
                      {session.tutor_name && (
                        <p className="text-gray-600">Tutor: <span className="font-medium">{session.tutor_name}</span></p>
                      )}
                      <p className="text-gray-600">Duration: <span className="font-medium">{session.duration} minutes</span></p>
                      <p className="text-gray-600">Created: <span className="font-medium">
                        {new Date(session.created_at).toLocaleDateString()}
                      </span></p>
                    </div>
                    <div>
                      <span className="block text-blue-500 font-bold text-xl">{session.cost} Credits</span>
                      {session.status === 'active' && (
                        <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                          Join Session
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Available Sessions Tab */}
      {activeTab === 'available-tab' && (
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Available Sessions</h2>
          {loading && <p className="text-gray-600">Loading available sessions...</p>}
          {!loading && availableSessions.length === 0 && (
            <p className="text-gray-600">No available sessions found.</p>
          )}
          {availableSessions.length > 0 && (
            <div className="space-y-4">
              {availableSessions.map((session) => (
                <div key={session.id} className="border p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">{session.topic}</h3>
                    <span className="font-medium text-blue-500">{session.cost} Credits</span>
                  </div>
                  <div className="flex flex-wrap md:flex-nowrap justify-between gap-6">
                    <div className="space-y-2">
                      <p className="text-gray-600">Student: <span className="font-medium">{session.student_name}</span></p>
                      <p className="text-gray-600">Duration: <span className="font-medium">{session.duration} minutes</span></p>
                      <p className="text-gray-600">Created: <span className="font-medium">
                        {new Date(session.created_at).toLocaleDateString()}
                      </span></p>
                    </div>
                    <div>
                      <button 
                        onClick={() => acceptSession(session.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        Accept Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}