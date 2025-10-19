import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthForm from "./components/AuthForm";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import UploadHistory from "./components/UploadHistory";
import DataVisualization from "./pages/DataVisualization/DataVisualization";
import AnalysisHistory from "./pages/DataVisualization/AnalysisHistory";
import AllUploadHistory from "./pages/AdminDashboard/AllUploadHistory";
import AdminAnalyses from "./pages/AdminDashboard/AdminAnalyses";
import SuperAdminPanel from "./pages/SuperAdmin/SuperAdminPanel";
import UserManagementPanel from "./pages/SuperAdmin/UserManagementPanel";
import UploadRecordsPanel from "./pages/SuperAdmin/UploadRecordsPanel";
import ChartAnalysesPanel from "./pages/SuperAdmin/ChartAnalysesPanel";
import ProfileMenu from "./pages/Profilesetting";

function PrivateRoute({ children, roles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthForm type="login" />} />
          <Route path="/register" element={<AuthForm type="register" />} />
          <Route path="/profile" element={<ProfileMenu />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={["user", "admin", "superadmin"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["admin", "superadmin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Removed PrivateRoute wrapper */}
          <Route path="/upload-history" element={<UploadHistory />} />
          <Route path="/analysis-history" element={<AnalysisHistory />} />
          <Route path="/visualize" element={<DataVisualization />} />
          <Route
            path="/admin/uploads"
            element={
              <PrivateRoute roles={["admin", "superadmin"]}>
                <AllUploadHistory />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/analyses"
            element={
              <PrivateRoute roles={["admin", "superadmin"]}>
                <AdminAnalyses />
              </PrivateRoute>
            }
          />
          <Route
            path="/superadmin"
            element={
              <PrivateRoute roles={["superadmin"]}>
                <SuperAdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users/manage"
            element={
              <PrivateRoute roles={["superadmin"]}>
                <UserManagementPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/upload-records"
            element={
              <PrivateRoute roles={["superadmin"]}>
                <UploadRecordsPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/chart-analyses"
            element={
              <PrivateRoute roles={["admin", "superadmin"]}>
                <ChartAnalysesPanel />
              </PrivateRoute>
            }
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
