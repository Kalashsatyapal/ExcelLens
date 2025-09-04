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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-green-50 text-gray-800">
      <Header showAdminButtons={false} />

      <main className="container mx-auto px-6 py-10 space-y-8 flex-grow">
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-green-700 mb-4">My Profile</h2>
          <div className="space-y-4 text-sm">
            <p><strong>Username:</strong> {user.username || "Not available"}</p>
            <p><strong>Email:</strong> {user.email || "Not available"}</p>
            <p><strong>Role:</strong> {user.role || "Not available"}</p>
            <p><strong>Account Created:</strong> {formatDate(user.createdAt)}</p>
            <p><strong>Last Updated:</strong> {formatDate(user.updatedAt)}</p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
