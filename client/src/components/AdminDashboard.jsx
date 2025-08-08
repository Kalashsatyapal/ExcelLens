import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6">Welcome, Admin <span className="font-semibold">{user.username}</span>!</p>
      <button
        onClick={logout}
        className="px-6 py-2 bg-red-600 rounded-md hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
