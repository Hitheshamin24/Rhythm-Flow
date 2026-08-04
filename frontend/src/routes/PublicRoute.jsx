import { Navigate } from "react-router-dom";

/**
 * PublicRoute
 * Wraps public-only routes (e.g. /auth).
 * If a token already exists in localStorage, the user is redirected to /dashboard
 * to prevent authenticated users from seeing the login page again.
 */
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
