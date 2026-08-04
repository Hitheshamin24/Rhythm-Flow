import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * Wraps any route that requires authentication.
 * If no token is found in localStorage, the user is redirected to /auth.
 * The current location is saved in state so they can be returned after login.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
