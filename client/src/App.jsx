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
import AdminDashboard from "./components/AdminDashboard";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import UploadHistory from "./components/UploadHistory";
import DataVisualization from "./pages/DataVisualization/DataVisualization";



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

          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={["user"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/upload-history"
            element={
              <PrivateRoute roles={["user"]}>
                <UploadHistory />
              </PrivateRoute>
            }
          />
         <Route
            path="/visualize"
            element={
              <PrivateRoute roles={["user"]}>
                <DataVisualization />
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
