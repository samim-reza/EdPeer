import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faBolt, faExclamationCircle, faCoins, faUser, faClock } from '@fortawesome/free-solid-svg-icons';

export default function SessionRequest() {
  const [activeTab, setActiveTab] = useState('request-tab');
  const [urgency, setUrgency] = useState('priority');
  const [duration, setDuration] = useState(30);
  const [credits, setCredits] = useState(10);
  const [tags, setTags] = useState(['JavaScript', 'Promises', 'Async']);
  const [newTag, setNewTag] = useState('');

  const addTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
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
        {['request-tab', 'active-tab', 'available-tab'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 capitalize ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab.replace('-', ' ').replace('tab', '')}
          </button>
        ))}
      </div>

      {/* Request Help Tab */}
      {activeTab === 'request-tab' && (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">Create New Help Request</h2>
            <form className="space-y-8">
              <div className="space-y-4">
                <label className="block text-lg font-medium">Session Title</label>
                <input
                  type="text"
                  placeholder="e.g., Help with JavaScript Promises"
                  className="w-full p-4 border rounded-lg"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-lg font-medium">Subject Category</label>
                  <select className="w-full p-4 border rounded-lg">
                    <option>Programming</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="block text-lg font-medium">Difficulty Level</label>
                  <select className="w-full p-4 border rounded-lg">
                    <option>Intermediate</option>
                    <option>Beginner</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-medium">Session Description</label>
                <textarea
                  className="w-full p-4 border rounded-lg h-32"
                  placeholder="Describe the specific problem or concept you need help with."
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
                          {type === 'standard' && '10 Credits'}
                          {type === 'priority' && '20 Credits'}
                          {type === 'urgent' && '30 Credits'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <button className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition">
                  Submit Request (Total: {20 + credits} Credits)
                </button>
              </div>
            </form>
          </div>

          {/* Matching Results */}
          <div className="bg-blue-50 p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">Potential Matches</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-blue-500 text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Tutor {i+1}</h3>
                      <div className="flex items-center gap-2 text-yellow-500">
                        {[...Array(5)].map((_, s) => (
                          <FontAwesomeIcon key={s} icon={faStar} />
                        ))}
                        <span className="text-gray-600">(42 sessions)</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded">JavaScript</span>
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded">React</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-bold">28</div>
                        <div className="text-gray-600 text-sm">Sessions</div>
                      </div>
                      <div>
                        <div className="font-bold">97%</div>
                        <div className="text-gray-600 text-sm">Satisfaction</div>
                      </div>
                      <div>
                        <div className="font-bold">15m</div>
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
        </div>
      )}

      {/* Other Tabs... */}
    </div>
  );
}