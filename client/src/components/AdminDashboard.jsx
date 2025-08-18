import React, { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Role counts
  const totalAccounts = users.length;
  const totalRegularUsers = users.filter(
    (u) => u.role === "user" && !u.isSuperAdmin
  ).length;
  const totalAdmins = users.filter(
    (u) => u.role === "admin" && !u.isSuperAdmin
  ).length;
  const totalSuperAdmins = users.filter((u) => u.isSuperAdmin).length;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
      {/* Topbar Header - Full Width */}
      <div className="bg-white text-gray-800 shadow-md py-4 px-6 flex items-center justify-between rounded-lg mb-6 max-w-full">
        <div className="text-2xl font-bold text-indigo-700">
          Admin Dashboard
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, <span className="font-semibold">{user.username}</span>
          </span>
          <button
            onClick={logout}
            className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto">
        {/* Summary Card */}
        <div className="bg-white text-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Total Accounts Registered:{" "}
            <span className="text-indigo-600">{totalAccounts}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-indigo-100 rounded-md p-4">
              <h3 className="text-lg font-medium mb-1">Regular Users</h3>
              <p className="text-2xl font-bold">{totalRegularUsers}</p>
            </div>
            <div className="bg-green-100 rounded-md p-4">
              <h3 className="text-lg font-medium mb-1">Admins</h3>
              <p className="text-2xl font-bold">{totalAdmins}</p>
            </div>
            <div className="bg-yellow-100 rounded-md p-4">
              <h3 className="text-lg font-medium mb-1">Super Admins</h3>
              <p className="text-2xl font-bold">{totalSuperAdmins}</p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white text-gray-800 rounded-lg shadow-md p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>

          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
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
                    <td className="border border-gray-300 px-4 py-2">
                      {u.username}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {u.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">
                      {u.isSuperAdmin ? "Super Admin" : u.role}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {u.isSuperAdmin ? (
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
