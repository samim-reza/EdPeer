import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faEnvelope, 
  faBars, 
  faHeadset, 
  faCheckCircle, 
  faCoins, 
  faStar,
  faCode,
  faUser,
  faHandshake,
  faHistory,
  faCog,
  faSignOutAlt,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { icon: faHeadset, title: 'Active Sessions', value: '3', color: 'blue' },
    { icon: faCheckCircle, title: 'Completed Sessions', value: '24', color: 'green' },
    { icon: faCoins, title: 'Available Credits', value: '120', color: 'purple' },
    { icon: faStar, title: 'Rating', value: '4.8', color: 'yellow' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="md:hidden"
            >
              <FontAwesomeIcon icon={faBars} className="text-gray-600" />
            </button>
            
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for topics, tutors, or sessions..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute left-3 top-3 text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-600 relative">
                <FontAwesomeIcon icon={faBell} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">3</span>
              </button>
              <button className="text-gray-600 relative">
                <FontAwesomeIcon icon={faEnvelope} />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">5</span>
              </button>
              <div className="flex items-center space-x-2">
                <img src="https://via.placeholder.com/40" alt="Profile" className="rounded-full" />
                <span className="text-gray-700">Samim</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform z-40`}>
        <div className="p-4">
          <div className="text-center mb-8">
            <img src="https://via.placeholder.com/80" alt="Profile" className="rounded-full mx-auto mb-4" />
            <h3 className="font-semibold">Samim</h3>
            <p className="text-gray-600 text-sm">Computer Science Student</p>
          </div>

          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => 
                `flex items-center space-x-3 p-2 rounded-lg ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/learning-session"
              className={({ isActive }) => 
                `flex items-center space-x-3 p-2 rounded-lg ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faCode} className="w-5 h-5" />
              <span>Learning Session</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) => 
                `flex items-center space-x-3 p-2 rounded-lg ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
              <span>Profile Management</span>
            </NavLink>

            <NavLink
              to="/session-request"
              className={({ isActive }) => 
                `flex items-center space-x-3 p-2 rounded-lg ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faHandshake} className="w-5 h-5" />
              <span>Session Request</span>
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) => 
                `flex items-center space-x-3 p-2 rounded-lg ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faHistory} className="w-5 h-5" />
              <span>Session History</span>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) => 
                `flex items-center space-x-3 p-2 rounded-lg ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Samim!</h1>
            <p className="text-gray-600">Here's what's happening with your learning journey today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`bg-${stat.color}-100 text-${stat.color}-600 w-12 h-12 rounded-full flex items-center justify-center`}>
                    <FontAwesomeIcon icon={stat.icon} className="text-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-8">
                {['overview', 'progress', 'achievements', 'notifications'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">No recent activity</p>
                  </div>
                </div>
              )}

              {activeTab === 'progress' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Learning Progress</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Progress charts coming soon</p>
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Achievements</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((_, i) => (
                      <div key={i} className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-blue-600 text-2xl mb-2">
                          <FontAwesomeIcon icon={faStar} />
                        </div>
                        <h3 className="font-medium">Achievement {i+1}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Notifications</h2>
                  <div className="space-y-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                        <p className="text-gray-600">Notification {i+1}</p>
                        <span className="text-sm text-gray-500">2h ago</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}