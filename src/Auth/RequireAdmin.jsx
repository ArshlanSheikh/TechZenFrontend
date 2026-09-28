import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function RequireAdmin({ children }) {
  const { accessToken, status, user } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <main role="status">Restoring your session...</main>;
  }

  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const roles = [...(Array.isArray(user.roles) ? user.roles : []), user.role];
  if (!roles.includes("admin")) {
    return <Navigate to="/" replace />;
  }

  return children;
}