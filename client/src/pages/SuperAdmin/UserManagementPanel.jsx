import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../utils/api";

export default function UserManagementPanel() {
  const { user } = useContext(AuthContext);
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
    <div className="min-h-screen bg-gradient-to-r from-indigo-700 to-purple-800 text-white">
      {/* Topbar */}
      <header className="w-full px-6 py-4 flex items-center justify-between bg-indigo-900 shadow-md">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md transition"
        >
          Go to Dashboard
        </button>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white text-purple-700 shadow-md px-6 py-3 flex flex-wrap gap-4 justify-start font-medium">
        <NavButton label="Dashboard" path="/dashboard" />
        <NavButton label="Admin Panel" path="/admin" />
        <NavButton label="Admin Requests" path="/superadmin" />
        <NavButton label="Uploads" path="/admin/uploads" />
        <NavButton label="Analyses History" path="/admin/analyses" />
        <NavButton label="User Management" path="/admin/users/manage" active />
      </nav>

      {/* Main Content */}
      <div className="px-6 py-10">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Total Accounts" value={users.length} color="from-indigo-500 to-purple-600" />
          <SummaryCard title="Users" value={users.filter(u => u.role === "user").length} color="from-green-400 to-teal-500" />
          <SummaryCard title="Admins" value={users.filter(u => u.role === "admin").length} color="from-yellow-400 to-orange-500" />
          <SummaryCard title="Super Admins" value={users.filter(u => u.role === "superadmin").length} color="from-pink-500 to-red-500" />
        </div>

        {/* User Table */}
        <div className="bg-white text-gray-800 rounded-lg shadow-md p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2 text-left">Username</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Role</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2 break-words max-w-xs">{u.username}</td>
                    <td className="border px-4 py-2 break-words max-w-xs">{u.email}</td>
                    <td className="border px-4 py-2 capitalize">
                      {u.role === "superadmin" ? "Super Admin" : u.role}
                    </td>
                    <td className="border px-4 py-2">
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

// 🔹 Summary Card Subcomponent
function SummaryCard({ title, value, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} text-white rounded-lg p-4 shadow-md`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

// 🔹 NavButton Subcomponent
function NavButton({ label, path, active }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className={`px-4 py-2 rounded-md transition ${
        active
          ? "bg-purple-700 text-white"
          : "hover:bg-purple-100 text-purple-700"
      }`}
    >
      {label}
    </button>
  );
}
