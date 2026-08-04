import { Navigate, Route, Routes } from "react-router-dom";

// Pages
import AuthPage from "../pages/AuthPage";
import DashBoardPage from "../pages/DashBoardPage";
import StudentsPage from "../pages/StudentsPage";
import AttendancePage from "../pages/AttendancePage";
import PaymentsPage from "../pages/PaymentsPage";
import FinancePage from "../pages/FinancePage";
import BatchesPage from "../pages/BatchesPage";
import SettingsPage from "../pages/SettingPage";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import DashBoardLayout from "../layouts/DashBoardLayout";

// Route Guards
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public Route ─────────────────────────────────────────────── */}
      {/* Blocked if already logged in → redirects to /dashboard         */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthLayout>
              <AuthPage />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* ── Protected Routes ─────────────────────────────────────────── */}
      {/* Blocked if not logged in → redirects to /auth                  */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashBoardLayout>
              <Routes>
                <Route path="/" element={<DashBoardPage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="finances" element={<FinancePage />} />
                <Route path="batches" element={<BatchesPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </DashBoardLayout>
          </ProtectedRoute>
        }
      />

      {/* ── Default ──────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
