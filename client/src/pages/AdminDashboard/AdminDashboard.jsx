import React, { useEffect, useState, useContext } from "react";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-slate-800 font-inter">
      <div className="container mx-auto px-6 py-8">
        {/* 🌟 Topbar */}
        <div className="flex justify-between items-center py-4 bg-white/60 backdrop-blur-md shadow-md rounded-xl px-6 border border-white/30">
          <div className="flex items-center space-x-4">
            <img src="/logo2.png" alt="Admin Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold tracking-tight text-cyan-700">ExcelLense</h1>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-md hover:scale-105 transition shadow-sm"
            >
              Go to Dashboard
            </button>
            {user.role === "superadmin" && (
              <button
                onClick={() => navigate("/superadmin")}
                className="px-4 py-2 bg-white/40 backdrop-blur-md border border-blue-300 text-blue-700 font-semibold rounded-md hover:bg-white/60 transition shadow-sm"
              >
                Super Admin Panel
              </button>
            )}

            {/* Profile Dropdown */}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex items-center gap-2 px-3 py-2 bg-white/40 backdrop-blur-md hover:bg-white/60 rounded-md text-sm font-medium text-slate-700 transition shadow-sm">
                <div className="h-8 w-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-semibold">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span>{user.username}</span>
                <ChevronDownIcon className="h-4 w-4 text-slate-500" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-20">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate("/profile")}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } group flex w-full items-center rounded-md px-4 py-2 text-sm text-slate-700`}
                      >
                        My Profile
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? "bg-red-100 text-red-700" : "text-red-600"
                        } group flex w-full items-center rounded-md px-4 py-2 text-sm font-semibold`}
                      >
                        Log Out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>

        {/* 👤 Logged-in Admin Info */}
        <div className="py-6">
          <div className="bg-blue-50 rounded-xl p-6 text-blue-900 shadow-md border border-blue-200">
            <h2 className="text-lg font-semibold mb-2">Current Logged-in Admin</h2>
            <p className="text-sm">Name: <span className="font-medium">{user?.username}</span></p>
            <p className="text-sm">Email: <span className="font-medium">{user?.email}</span></p>
          </div>
        </div>

        {/* 📁 Navigation Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/uploads")}
            className="px-4 py-2 bg-cyan-100 text-cyan-700 font-semibold rounded-md hover:bg-cyan-200 transition"
          >
            View Upload History
          </button>
          <button
            onClick={() => navigate("/admin/analyses")}
            className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200 transition"
          >
            View All Analyses
          </button>
        </div>

        {/* 📊 Summary Container */}
        <div className="py-6">
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/30">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Account Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Total Accounts</h3>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <div className="bg-gradient-to-br from-sky-400 to-cyan-500 text-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Users</h3>
                <p className="text-3xl font-bold">
                  {users.filter((u) => u.role === "user").length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-indigo-400 to-blue-500 text-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Admins</h3>
                <p className="text-3xl font-bold">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Super Admins</h3>
                <p className="text-3xl font-bold">
                  {users.filter((u) => u.role === "superadmin").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 📋 Registered Users Table */}
        <div className="bg-white/60 backdrop-blur-md text-slate-800 rounded-xl shadow-md p-6 border border-white/30 overflow-x-auto w-full">
          <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
          {loading ? (
            <p className="text-slate-500">Loading users...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <table className="min-w-full border-collapse border border-slate-300">
              <thead className="bg-white/70 backdrop-blur-md">
                <tr>
                  <th className="border border-slate-300 px-4 py-2 text-left">Username</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">                    Role
                  </th>
                  <th className="border border-slate-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/80 transition">
                    <td className="border border-slate-300 px-4 py-2 break-words max-w-xs">
                      {u.username}
                    </td>
                    <td className="border border-slate-300 px-4 py-2 break-words max-w-xs">
                      {u.email}
                    </td>
                    <td className="border border-slate-300 px-4 py-2 capitalize">
                      {u.role === "superadmin" ? "Super Admin" : u.role}
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      {u.role === "superadmin" ? (
                        <span className="text-slate-400 italic">Immutable</span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u._id, e.target.value)}
                          className="px-2 py-1 border border-slate-300 rounded-md bg-white/70 backdrop-blur-md text-slate-800"
                          disabled={user.role === "admin" && u.role !== "user"}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
