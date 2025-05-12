import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCode,
  faArrowRight,
  faUser,
  faHandshake,
  faHistory,
  faSignOutAlt,
  faCoins,
  faMoneyBillWave,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ sidebarOpen }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const userName = user?.fullName || "Mr. User";
  const userBio = user?.bio || "Brilliant Student";
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform z-40`}
    >
      <div className="p-4 mt-4">
        <div className="text-center mb-8">
          <img
            src="https://via.placeholder.com/80"
            alt="Profile"
            className="rounded-full mx-auto mb-4"
          />
          <h3 className="font-semibold" style={{ textTransform: "capitalize" }}>
            {userName}
          </h3>

          <p className="text-gray-600 text-sm">{userBio}</p>
        </div>

        <nav className="space-y-1">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2 rounded-lg ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
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
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <FontAwesomeIcon icon={faCode} className="w-5 h-5" />
            <span>Learning Session</span>
          </NavLink>

          <NavLink
            to="/accepted-sessions"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2 rounded-lg ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
            <span>Accepted Session</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2 rounded-lg ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
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
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <FontAwesomeIcon icon={faHandshake} className="w-5 h-5" />
            <span>Session Request</span>
          </NavLink>

          

          <NavLink
            to="/session-history"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2 rounded-lg ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <FontAwesomeIcon icon={faHistory} className="w-5 h-5" />
            <span>Session History</span>
          </NavLink>

          <NavLink
            to="/add-credit"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2 rounded-lg ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <FontAwesomeIcon icon={faCoins} className="w-5 h-5" />
            <span>Add Credits</span>
          </NavLink>

          <NavLink
            to="/withdraw-credit"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2 rounded-lg ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <FontAwesomeIcon icon={faMoneyBillWave} className="w-5 h-5" />
            <span>Withdraw Credits</span>
          </NavLink>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full text-left mt-4"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
