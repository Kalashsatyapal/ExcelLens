import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import UploadSection from "../components/UploadSection";
import { Link } from "react-router-dom";


export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-700">
          Dashboard - Welcome, {user.username}
        </h1>
        <div className="space-x-4">
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <UploadSection />
        <div>
          {" "}
          <Link
            to="/upload-history"
            className="inline-block px-4 py-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-gray-800 font-medium rounded-md border border-gray-300 hover:from-gray-300 hover:via-gray-400 hover:to-gray-500 transition duration-200"
          >
            Upload History
          </Link>
        </div>
        <div>
          <Link
            to="/visualize"
            className="inline-block px-4 py-2 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 text-blue-800 font-medium rounded-md border border-blue-300 hover:from-blue-300 hover:via-blue-400 hover:to-blue-500 transition duration-200"
          >
            Data Visualization
          </Link>
          </div>
      </main>
    </div>
  );
}
