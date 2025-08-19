import React, { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
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
      {/* 🌟 Topbar */}
      <div className="flex justify-between items-center px-6 py-4 bg-purple-700 shadow-md">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md transition"
          >
            Go to Dashboard
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>

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
  );
}
