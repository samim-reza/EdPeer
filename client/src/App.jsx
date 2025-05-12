import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import LearningSession from './pages/LearningSession';
import ProfileManagement from './pages/ProfileManagement';
import SessionRequest from './pages/SessionRequest';
import AllSessions from './pages/AllSession'
import AcceptedSessionsPage from './pages/AccpetedSessions';
import VideoCallRoom from './pages/Room/VideoCallRoom';
import Navbar from './pages/shared/Navbar';
import SenderProfile from './pages/SenderProfile/SenderProfile';
import AddCredit from './pages/Dashboard/AddCredit';
import WithdrawCredit from './pages/Dashboard/WithdrawCredit';
import SessionHistory from './pages/Dashboard/SessionHistory';
import Conversations from './pages/Conversations/Conversations';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learning-session" element={<LearningSession />} />
        <Route path="/profile" element={<ProfileManagement />} />
        <Route path="/session-request" element={<SessionRequest />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/add-credit" element={<AddCredit />} />
        <Route path="/withdraw-credit" element={<WithdrawCredit />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/all-sessions" element={<AllSessions />} />
        <Route path="/accepted-sessions" element={<AcceptedSessionsPage />} />
        <Route path="/room/:sessionId" element={<VideoCallRoom />} />
        <Route path="/userProfile/:userId" element={<SenderProfile />} />
        <Route path="/session-history" element={<SessionHistory />} />
        <Route path="/conversations" element={<Conversations />} />
      </Routes>
    </Router>
  );
}