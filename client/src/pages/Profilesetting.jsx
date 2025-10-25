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
  const [nameMessage, setNameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [imageMessage, setImageMessage] = useState("");
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
  };

  // ✅ Update username
  const handleNameChange = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setNameMessage("Name cannot be empty.");
    setLoadingName(true);
    setNameMessage("");
    try {
      const res = await api.put("/auth/update-name", { name });
      setUser((prev) => ({ ...prev, username: res.data.username }));
      setNameMessage("✅ Name updated successfully!");
    } catch {
      setNameMessage("❌ Failed to update name.");
    } finally {
      setLoadingName(false);
    }
  };

  // ✅ Update password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!password.trim()) return setPasswordMessage("Password cannot be empty.");
    setLoadingPassword(true);
    setPasswordMessage("");
    try {
      await api.put("/auth/update-password", { password });
      setPasswordMessage("✅ Password updated successfully!");
      setPassword("");
    } catch {
      setPasswordMessage("❌ Failed to update password.");
    } finally {
      setLoadingPassword(false);
    }
  };

  // ✅ Update profile image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoadingImage(true);
    setImageMessage("");
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      const res = await api.post("/auth/update-profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => ({ ...prev, profileImage: res.data.profileImage }));
      setPreview(res.data.profileImage);
      setImageMessage("✅ Profile image updated!");
    } catch {
      setImageMessage("❌ Failed to update image.");
    } finally {
      setLoadingImage(false);
    }
  };

return (
  <div className="min-h-screen flex flex-col bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900 text-slate-100 font-sans">
    {/* Header */}
    <header className="bg-slate-800/60 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo2.png" alt="Logo" className="w-14 h-14 object-contain transition-transform hover:scale-105" />
          <h1 className="text-3xl font-bold text-cyan-400 tracking-wide">ExcelLense</h1>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="container mx-auto px-6 py-10 flex-grow space-y-8">
      <section className="bg-slate-800/40 backdrop-blur-lg rounded-xl border border-slate-700 shadow-lg p-6">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-slate-300 mb-8">
          Profile & Settings
        </h2>

        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border border-slate-600 bg-slate-700"
              />
            ) : (
              <div className="h-24 w-24 flex items-center justify-center bg-slate-700 rounded-full border border-slate-600">
                <UserIcon className="h-12 w-12 text-slate-400" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-cyan-500/20 backdrop-blur-md border border-cyan-500 text-cyan-300 px-2 py-1 text-xs rounded-md cursor-pointer hover:bg-slate-600 transition">
              Change
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={loadingImage}
              />
            </label>
          </div>

          <div className="space-y-2 text-slate-300">
            <p><span className="text-cyan-400 font-medium">Username:</span> {user?.username || "Not available"}</p>
            <p><span className="text-indigo-400 font-medium">Email:</span> {user?.email || "Not available"}</p>
            <p><span className="text-cyan-400 font-medium">Role:</span> {user?.role || "Not available"}</p>
            <p><span className="text-indigo-400 font-medium">Account Created:</span> {formatDate(user?.createdAt)}</p>
            <p><span className="text-cyan-400 font-medium">Last Updated:</span> {formatDate(user?.updatedAt)}</p>
          </div>
        </div>

        {/* Status Messages */}
        {imageMessage && (
          <div className={`mb-4 px-4 py-2 rounded-md text-sm ${
            imageMessage.startsWith("✅") 
              ? "bg-green-500/20 border border-green-500 text-green-300"
              : "bg-red-500/20 border border-red-500 text-red-300"
          }`}>
            {imageMessage}
          </div>
        )}

        {/* Update Username Form */}
        {nameMessage && (
          <div className={`mb-3 px-4 py-2 rounded-md text-sm ${
            nameMessage.startsWith("✅")
              ? "bg-green-500/20 border border-green-500 text-green-300"
              : "bg-red-500/20 border border-red-500 text-red-300"
          }`}>
            {nameMessage}
          </div>
        )}
        <form onSubmit={handleNameChange} className="mb-6">
          <label className="block mb-2 font-semibold text-slate-300">Change Username</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-800/40 backdrop-blur-lg rounded-md border border-slate-700 text-slate-300"
              disabled={loadingName}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-cyan-500 text-cyan-300 rounded-md hover:bg-slate-600 transition"
              disabled={loadingName}
            >
              {loadingName ? "Updating..." : "Update"}
            </button>
          </div>
        </form>

        {/* Update Password Form */}
        {passwordMessage && (
          <div className={`mb-3 px-4 py-2 rounded-md text-sm ${
            passwordMessage.startsWith("✅")
              ? "bg-green-500/20 border border-green-500 text-green-300"
              : "bg-red-500/20 border border-red-500 text-red-300"
          }`}>
            {passwordMessage}
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="mb-6">
          <label className="block mb-2 font-semibold text-slate-300">Change Password</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-800/40 backdrop-blur-lg rounded-md border border-slate-700 text-slate-300"
              disabled={loadingPassword}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-indigo-500 text-indigo-300 rounded-md hover:bg-slate-600 transition"
              disabled={loadingPassword}
            >
              {loadingPassword ? "Updating..." : "Update"}
            </button>
          </div>
        </form>

        {/* Navigation */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-slate-500 text-slate-300 rounded-md hover:bg-slate-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </section>
    </main>

    {/* Footer */}
    <footer className="bg-slate-800 py-6 border-t border-slate-700">
      <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} <span className="font-semibold text-cyan-400">ExcelLense</span>. Built with precision and passion.
      </div>
    </footer>
  </div>
);}