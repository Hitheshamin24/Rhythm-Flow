import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * Wraps any route that requires authentication.
 * If no token is found in localStorage, the user is redirected to /auth.
 *
 * Optional prop `ownerOnly` – if true, trainers are redirected to /dashboard.
 */
const ProtectedRoute = ({ children, ownerOnly = false }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "owner";
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Block trainers from owner-only routes (Finance, Settings, Approvals)
  if (ownerOnly && role === "trainer") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
