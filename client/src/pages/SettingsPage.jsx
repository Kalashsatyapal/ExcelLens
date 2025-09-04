import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SettingsPage() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user.username);
  const [password, setPassword] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    // TODO: Call API to update name and password
    console.log("Updated:", { name, password });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Account Settings</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
