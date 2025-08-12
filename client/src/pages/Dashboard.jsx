import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UploadSection from "../components/UploadSection";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      {/* Header */}
      <header className="flex justify-between items-center bg-green-500 shadow px-6 py-4">
        <h1 className="text-xl font-semibold text-white">
          Dashboard - Welcome, {user.username}
        </h1>
        <div className="space-x-4">
          <button
            onClick={logout}
            className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 bg-white shadow-inner rounded-t-lg">
        <UploadSection />
        
        <div className="mt-6">
          <Link
            to="/upload-history"
            className="inline-block px-4 py-2 bg-green-400 text-white font-medium rounded-md hover:bg-green-500 transition duration-200"
          >
            Upload History
          </Link>
        </div>
      </main>
    </div>
  );
}
