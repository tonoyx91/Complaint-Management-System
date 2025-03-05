import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    console.log("ProtectedRoute - Waiting for user to load...");
    return <div>Loading...</div>;  // 🔹 Prevents redirecting too early
  }

  const userRole = user.role?.toLowerCase(); // 🔹 Normalize role to lowercase

  if (!allowedRoles.includes(userRole)) {
    console.log("ProtectedRoute - Unauthorized Access! Redirecting to login...");
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute - Access Granted! Role:", userRole);
  return children;
};

export default ProtectedRoute;
