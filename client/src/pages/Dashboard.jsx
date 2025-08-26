import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UploadSection from "../components/UploadSection";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-green-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm px-6 py-5 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src="logo2.png"
            alt="Logo"
            className="h-10 w-auto rounded-md shadow-sm"
          />
          <h1 className="text-2xl font-bold tracking-tight text-green-700">
            ExcelLense
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {["admin", "superadmin"].includes(user.role) && (
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 font-semibold rounded-md hover:from-green-200 hover:to-green-300 transition"
            >
              Admin Panel
            </button>
          )}
          {user.role === "superadmin" && (
            <button
              onClick={() => navigate("/superadmin")}
              className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 font-semibold rounded-md hover:from-purple-200 hover:to-purple-300 transition"
            >
              Super Admin Panel
            </button>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-600 font-semibold rounded-md hover:from-red-200 hover:to-red-300 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 space-y-8 flex-grow">
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <UploadSection />
        </section>

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

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
