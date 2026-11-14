import { Navigate, Route, Routes } from "react-router-dom";

// Pages
import AuthPage from "../features/auth/UI/pages/AuthPage";
import DashBoardPage from "../features/dashboard/UI/pages/DashBoardPage";
import StudentsPage from "../features/students/UI/pages/StudentsPage";
import AttendancePage from "../features/attendance/UI/pages/AttendancePage";
import PaymentsPage from "../features/payments/UI/pages/PaymentsPage";
import FinancePage from "../features/finance/UI/pages/FinancePage";
import BatchesPage from "../features/batches/UI/pages/BatchesPage";
import SettingsPage from "../features/settings/UI/pages/SettingPage";
import TrainerApprovalsPage from "../features/staff/UI/pages/TrainerApprovalsPage";

// Layouts
import AuthLayout from "../shared/layouts/AuthLayout";
import DashBoardLayout from "../shared/layouts/DashBoardLayout";

// Route Guards
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
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
                <Route path="batches" element={<BatchesPage />} />

                {/* Owner-only routes – trainers are redirected away */}
                <Route
                  path="finances"
                  element={
                    <ProtectedRoute ownerOnly>
                      <FinancePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute ownerOnly>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="trainer-approvals"
                  element={
                    <ProtectedRoute ownerOnly>
                      <TrainerApprovalsPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </DashBoardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;

