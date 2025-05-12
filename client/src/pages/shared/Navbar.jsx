import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faUser,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = Boolean(user?.id);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login"; // Full page reload to clear state
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">
              EdPeer
            </a>
          </div>

          <div className="hidden md:flex space-x-8">
            <a
              href="all-sessions"
              className="text-gray-700 hover:text-blue-600"
            >
              Sessions
            </a>
            <a href="#features" className="text-gray-700 hover:text-blue-600">
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-blue-600"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-blue-600"
            >
              Testimonials
            </a>
            <a href="#about-us" className="text-gray-700 hover:text-blue-600">
              About Us
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={goToDashboard}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <FontAwesomeIcon icon={faUser} size="sm" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-blue-600">
                    {user.fullName || "My Account"}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="text-gray-400 text-xs group-hover:text-blue-600"
                  />
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
