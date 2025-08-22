import React, { useEffect, useState, useContext } from "react";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      fetchUsers(); // refresh
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* 🌟 Topbar */}
        <div className="flex justify-between items-center py-4 bg-purple-700 shadow-md rounded-b-lg px-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md transition"
            >
              Go to Dashboard
            </button>
            {user.role === "superadmin" && (
              <button
                onClick={() => navigate("/superadmin")}
                className="px-4 py-2 bg-white text-purple-700 font-semibold rounded-lg hover:bg-purple-100 transition"
              >
                Super Admin Panel
              </button>
            )}
          </div>
        </div>

        {/* 👤 Logged-in Admin Info */}
        <div className="py-4">
          <div className="bg-purple-800 rounded-lg p-4 text-white shadow-md">
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
        <div>
          <button
            onClick={() => navigate("/admin/uploads")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition"
          >
            View Upload History
          </button>
          <button
            onClick={() => navigate("/admin/analyses")}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md transition"
          >
            View All Analyses
          </button>
        </div>
        {/* 📊 Summary Container */}
        <div className="py-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Account Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 🌐 Total Accounts */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Total Accounts</h3>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>

              {/* 🧑 Users */}
              <div className="bg-gradient-to-br from-green-400 to-teal-500 text-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Users</h3>
                <p className="text-3xl font-bold">
                  {users.filter((u) => u.role === "user").length}
                </p>
              </div>

              {/* 🛠️ Admins */}
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Admins</h3>
                <p className="text-3xl font-bold">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>

              {/* 👑 Super Admins */}
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
        <div className="bg-white text-gray-800 rounded-lg shadow-md p-6 overflow-x-auto w-full">
          <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>

          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
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
                  <tr key={u._id} className="hover:bg-gray-100">
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
