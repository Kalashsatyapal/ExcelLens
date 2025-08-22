import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function SuperAdminPanel() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-pink-600 text-white flex flex-col">
      {/* Topbar */}
      <header className="w-full px-6 py-4 bg-white/10 backdrop-blur-md flex items-center justify-between shadow-md">
        <h2 className="text-xl font-bold tracking-wide">Super Admin Panel</h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden sm:inline">
            {user?.username} <span className="opacity-70">({user?.role})</span>
          </span>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
          >
            Go to User Dashboard
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
          >
            Go to Admin Panel
          </button>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition text-xs font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="bg-white text-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-6">Welcome, Superadmin</h1>

          <div className="space-y-4"></div>
        </div>
      </main>
    </div>
  );
}
