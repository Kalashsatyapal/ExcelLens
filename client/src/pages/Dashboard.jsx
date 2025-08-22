import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UploadSection from "../components/UploadSection";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-green-500 text-white shadow-md px-6 py-5 flex justify-between items-center rounded-b-xl">
        <div className="flex items-center gap-4">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="h-10 w-auto rounded-md shadow-sm"
          />
          <h1 className="text-2xl font-bold tracking-wide">ExcelLense</h1>
        </div>
        <div className="flex items-center gap-3">
          {["admin", "superadmin"].includes(user.role) && (
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-100 transition"
            >
              Admin Panel
            </button>
          )}
          {user.role === "superadmin" && (
            <button
              onClick={() => navigate("/superadmin")}
              className="px-4 py-2 bg-white text-purple-700 font-semibold rounded-lg hover:bg-purple-100 transition"
            >
              Super Admin Panel
            </button>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-8">
        {/* Upload Section */}
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <UploadSection />
        </section>

        {/* Navigation Links */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link
            to="/upload-history"
            className="block bg-green-100 text-green-900 font-semibold text-center py-5 rounded-xl shadow hover:bg-green-200 transition"
          >
            📁 Upload History
          </Link>
          <Link
            to="/analysis-history"
            className="block bg-sky-100 text-sky-900 font-semibold text-center py-5 rounded-xl shadow hover:bg-sky-200 transition"
          >
            📊 Analysis History
          </Link>
          <Link
            to="/visualize"
            className="block bg-gray-100 text-gray-800 font-semibold text-center py-5 rounded-xl shadow hover:bg-gray-200 transition"
          >
            📈 Data Visualization
          </Link>
        </section>
      </main>
    </div>
  );
}
