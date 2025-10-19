import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/solid";

export default function ProfileAndSettings() {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState(user?.profileImage || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
  };

  // ✅ Update username
  const handleNameChange = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setMessage("Name cannot be empty.");
    setLoading(true);
    try {
      const res = await api.put("/auth/update-name", { name });
      setUser((prev) => ({ ...prev, username: res.data.username }));
      setMessage("✅ Name updated successfully!");
    } catch {
      setMessage("❌ Failed to update name.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!password.trim()) return setMessage("Password cannot be empty.");
    setLoading(true);
    try {
      await api.put("/auth/update-password", { password });
      setMessage("✅ Password updated successfully!");
      setPassword("");
    } catch {
      setMessage("❌ Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update profile image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      const res = await api.post("/auth/update-profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => ({ ...prev, profileImage: res.data.profileImage }));
      setPreview(res.data.profileImage);
      setMessage("✅ Profile image updated!");
    } catch {
      setMessage("❌ Failed to update image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-slate-800 font-inter">
      <div className="container mx-auto max-w-2xl mt-10 px-6 py-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/30">
        <h2 className="text-2xl font-bold text-cyan-700 mb-6 flex items-center gap-2">
          <span className="material-icons text-cyan-600">person</span>
          My Profile & Settings
        </h2>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded-md text-sm ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border bg-gray-100 shadow"
              />
            ) : (
              <div className="h-24 w-24 flex items-center justify-center bg-gray-100 rounded-full border shadow">
                <UserIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-cyan-600 text-white px-2 py-1 text-xs rounded-md cursor-pointer hover:bg-cyan-700 transition">
              Change
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={loading}
              />
            </label>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Username:</strong> {user?.username || "Not available"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "Not available"}
            </p>
            <p>
              <strong>Role:</strong> {user?.role || "Not available"}
            </p>
            <p>
              <strong>Account Created:</strong> {formatDate(user?.createdAt)}
            </p>
            <p>
              <strong>Last Updated:</strong> {formatDate(user?.updatedAt)}
            </p>
          </div>
        </div>

        {/* Update Username */}
        <form onSubmit={handleNameChange} className="mb-6">
          <label className="block mb-2 font-semibold">Change Username</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md"
              disabled={loading}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>

        {/* Update Password */}
        <form onSubmit={handlePasswordChange} className="mb-6">
          <label className="block mb-2 font-semibold">Change Password</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md"
              disabled={loading}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>

        {/* Navigation */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <footer className="bg-gradient-to-r from-gray-100 to-cyan-100 py-6 mt-auto border-t border-gray-200">
        <div className="container mx-auto text-center text-slate-500 text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-cyan-700">ExcelLense</span>. Built
          with precision and passion.
        </div>
      </footer>
    </div>
  );
}
