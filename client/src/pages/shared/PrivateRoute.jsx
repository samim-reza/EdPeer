import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check for user in localStorage
  const user = localStorage.getItem("user");

  try {
    const userData = user ? JSON.parse(user) : null;

    // If no user ID exists, redirect to login
    if (!userData?.id) {
      return <Navigate to="/login" replace />;
    }

    // If authenticated, render the children
    return children;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
