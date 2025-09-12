import React, { useContext } from "react";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-slate-800 font-inter">
      <Header showAdminButtons={true} />

      <main className="container mx-auto px-6 py-10 space-y-8 flex-grow">
        <section className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/30">
          <h2 className="text-xl font-bold text-cyan-700 mb-4">My Profile</h2>
          <div className="space-y-4 text-sm text-slate-700">
            <p><strong>Username:</strong> {user.username || "Not available"}</p>
            <p><strong>Email:</strong> {user.email || "Not available"}</p>
            <p><strong>Role:</strong> {user.role || "Not available"}</p>
            <p><strong>Account Created:</strong> {formatDate(user.createdAt)}</p>
            <p><strong>Last Updated:</strong> {formatDate(user.updatedAt)}</p>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-gray-100 to-cyan-100 py-6 mt-auto border-t border-gray-200">
        <div className="container mx-auto text-center text-slate-500 text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-cyan-700">ExcelLense</span>. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
