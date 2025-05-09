import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import LearningSession from './pages/LearningSession';
import ProfileManagement from './pages/ProfileManagement';
import SessionRequest from './pages/SessionRequest';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learning-session" element={<LearningSession />} />
        <Route path="/profile" element={<ProfileManagement />} />
        <Route path="/session-request" element={<SessionRequest />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Routes>
    </Router>
  );
}