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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-purple-50 text-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* 🌟 Topbar */}
        <div className="flex justify-between items-center py-4 bg-white shadow-md rounded-xl px-6 border border-purple-200">
          <div className="flex items-center space-x-4">
            <img
              src="/logo2.png" // Adjust path if needed
              alt="Admin Logo"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-2xl font-bold tracking-tight text-green-700">
              ExcelLense
            </h1>
          </div>
          <h1 className="text-2xl font-bold text-purple-700">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 font-semibold rounded-md hover:from-green-200 hover:to-green-300 transition"
            >
              Go to Dashboard
            </button>
            {user.role === "superadmin" && (
              <button
                onClick={() => navigate("/superadmin")}
                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 font-semibold rounded-md hover:from-purple-200 hover:to-purple-300 transition"
              >
                Super Admin Panel
              </button>
            )}

            {/* Profile Dropdown */}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition">
                <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span>{user.username}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-20">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate("/profile")}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700`}
                      >
                        My Profile
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate("/settings")}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700`}
                      >
                        Account Settings
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
          <div className="bg-purple-100 rounded-xl p-6 text-purple-900 shadow-md border border-purple-200">
            <h2 className="text-lg font-semibold mb-2">
              Current Logged-in Admin
            </h2>
            <p className="text-sm">
              Name: <span className="font-medium">{user?.username}</span>
            </p>
            <p className="text-sm">
              Email: <span className="font-medium">{user?.email}</span>
            </p>
          </div>
        </div>

        {/* 📁 Navigation Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/uploads")}
            className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200 transition"
          >
            View Upload History
          </button>
          <button
            onClick={() => navigate("/admin/analyses")}
            className="px-4 py-2 bg-sky-100 text-sky-700 font-semibold rounded-md hover:bg-sky-200 transition"
          >
            View All Analyses
          </button>
        </div>

        {/* 📊 Summary Container */}
        <div className="py-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Account Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Total Accounts</h3>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-teal-500 text-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Users</h3>
                <p className="text-3xl font-bold">
                  {users.filter((u) => u.role === "user").length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-lg p-4 shadow-md">
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
        <div className="bg-white text-gray-800 rounded-xl shadow-md p-6 border border-gray-200 overflow-x-auto w-full">
          <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Username
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Email
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Role
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 break-words max-w-xs">
                      {u.username}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 break-words max-w-xs">
                      {u.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">
                      {u.role === "superadmin" ? "Super Admin" : u.role}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {u.role === "superadmin" ? (
                        <span className="text-gray-400 italic">Immutable</span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u._id, e.target.value)}
                          className="px-2 py-1 border rounded-md"
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
