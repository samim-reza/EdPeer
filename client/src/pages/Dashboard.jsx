import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
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
  faHome,
  faExclamationCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import api from '../config/api-client';
import Sidebar from './shared/SideBar';
import Stats from './Dashboard/Stats';

export default function Dashboard() {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [activeTab, setActiveTab] = useState('overview');

// Data states
const [dashboardSummary, setDashboardSummary] = useState({
  credits: 0,
  rating: 0,
  activeSessions: 0,
  completedSessions: 0
});
const [recentActivity, setRecentActivity] = useState([]);
const [achievements, setAchievements] = useState([]);
const [notifications, setNotifications] = useState([]);

// Loading and error states
const [loading, setLoading] = useState({
  summary: true,
  activity: true,
  achievements: true,
  notifications: true
});
const [error, setError] = useState({
  summary: null,
  activity: null,
  achievements: null,
  notifications: null
});

// Fetch dashboard summary
useEffect(() => {
  const fetchSummary = async () => {
    try {
      const response = await api.get('/api/dashboard/summary');
      console.log("res", response)
      setDashboardSummary(response.data);
      setLoading(prev => ({ ...prev, summary: false }));
    } catch (err) {
      console.error('Failed to fetch dashboard summary:', err);
      setError(prev => ({ ...prev, summary: 'Failed to load dashboard data' }));
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };
  
  fetchSummary();
}, []);

// Fetch activity data when activating the overview tab
useEffect(() => {
  if (activeTab === 'overview') {
    const fetchActivity = async () => {
      setLoading(prev => ({ ...prev, activity: true }));
      try {
        const response = await api.get('/api/dashboard/activity');
        setRecentActivity(response.data);
        setLoading(prev => ({ ...prev, activity: false }));
      } catch (err) {
        console.error('Failed to fetch activity:', err);
        setError(prev => ({ ...prev, activity: 'Failed to load recent activity' }));
        setLoading(prev => ({ ...prev, activity: false }));
      }
    };
    
    fetchActivity();
  }
}, [activeTab]);

// Fetch achievements when activating the achievements tab
useEffect(() => {
  if (activeTab === 'achievements') {
    const fetchAchievements = async () => {
      setLoading(prev => ({ ...prev, achievements: true }));
      try {
        const response = await api.get('/api/dashboard/achievements');
        setAchievements(response.data);
        setLoading(prev => ({ ...prev, achievements: false }));
      } catch (err) {
        console.error('Failed to fetch achievements:', err);
        setError(prev => ({ ...prev, achievements: 'Failed to load achievements' }));
        setLoading(prev => ({ ...prev, achievements: false }));
      }
    };
    
    fetchAchievements();
  }
}, [activeTab]);

// Fetch notifications when activating the notifications tab
useEffect(() => {
  if (activeTab === 'notifications') {
    const fetchNotifications = async () => {
      setLoading(prev => ({ ...prev, notifications: true }));
      try {
        const response = await api.get('/api/dashboard/notifications');
        setNotifications(response.data);
        setLoading(prev => ({ ...prev, notifications: false }));
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError(prev => ({ ...prev, notifications: 'Failed to load notifications' }));
        setLoading(prev => ({ ...prev, notifications: false }));
      }
    };
    
    fetchNotifications();
  }
}, [activeTab]);

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const stats = [
  { icon: faHeadset, title: 'Active Sessions', value: dashboardSummary.activeSessions.toString(), color: 'blue' },
  { icon: faCheckCircle, title: 'Completed Sessions', value: dashboardSummary.completedSessions.toString(), color: 'green' },
  { icon: faCoins, title: 'Available Credits', value: dashboardSummary.credits.toString(), color: 'purple' },
  { icon: faStar, title: 'Rating', value: dashboardSummary.rating.toString(), color: 'yellow' },
];

return (
  <div className="min-h-screen bg-gray-50">

    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <main className="md:ml-64 pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Stats />

        {/* Dashboard Tabs */}
        
      </div>
    </main>
  </div>
);
}