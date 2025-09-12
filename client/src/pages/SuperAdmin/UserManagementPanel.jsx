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

  const blockUnblockUser = async (id, blocked) => {
    try {
      await API.put(`/admin/users/${id}/block`, { blocked });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update block status");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-slate-800 font-inter">
      {/* 🌟 Topbar */}
      <div className="sticky top-0 z-20 bg-white/30 backdrop-blur-md shadow-md border-b border-cyan-100">
        <div className="max-w-screen-xl mx-auto px-6 py-6 relative flex items-center justify-start gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo2.png"
              alt="ExcelLense Logo"
              className="h-10 w-10 object-contain rounded-md shadow-md"
            />
            <h1 className="text-2xl font-extrabold tracking-tight text-cyan-700">
              ExcelLense
            </h1>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-wide text-blue-600">
              👥 User Management Panel
            </h2>
          </div>
        </div>
      </div>

      {/* 🧭 Navigation Bar */}
      <nav className="bg-white/60 backdrop-blur-md text-slate-700 shadow-md px-6 py-3 flex flex-wrap gap-4 justify-start font-medium border-b border-white/30">
        <NavButton label="Dashboard" path="/dashboard" />
        <NavButton label="Admin Panel" path="/admin" />
        <NavButton label="Admin Requests" path="/superadmin" />
        <NavButton label="Uploads records" path="/admin/upload-records" />
        <NavButton label="Analyses History" path="/admin/chart-analyses" />
        <NavButton label="User Management" path="/admin/users/manage" active />
      </nav>

      {/* 📄 Main Content */}
      <div className="px-6 py-10 max-w-screen-xl mx-auto">
        {/* 📊 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Accounts"
            value={users.length}
            color="from-cyan-500 to-blue-500"
          />
          <SummaryCard
            title="Users"
            value={users.filter((u) => u.role === "user").length}
            color="from-sky-400 to-cyan-500"
          />
          <SummaryCard
            title="Admins"
            value={users.filter((u) => u.role === "admin").length}
            color="from-indigo-400 to-blue-500"
          />
          <SummaryCard
            title="Super Admins"
            value={users.filter((u) => u.role === "superadmin").length}
            color="from-pink-500 to-red-500"
          />
        </div>

        {/* 👥 User Table */}
        <div className="bg-white/60 backdrop-blur-md text-slate-800 rounded-lg shadow-md p-6 border border-white/30 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
          {loading ? (
            <p className="text-slate-500">Loading users...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <table className="min-w-full border-collapse border border-slate-300">
              <thead className="bg-white/70 backdrop-blur-md">
                <tr>
                  <th className="border px-4 py-2 text-left">Username</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Role</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/80 transition">
                    <td className="border px-4 py-2 break-words max-w-xs">{u.username}</td>
                    <td className="border px-4 py-2 break-words max-w-xs">{u.email}</td>
                    <td className="border px-4 py-2 capitalize">
                      {u.role === "superadmin" ? "Super Admin" : u.role}
                    </td>
                    <td className="border px-4 py-2">
                      {u.blocked ? (
                        <span className="text-red-500 font-semibold">Blocked</span>
                      ) : (
                        <span className="text-green-600 font-semibold">Active</span>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {u.role === "superadmin" ? (
                        <span className="text-slate-400 italic">Immutable</span>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <select
                            value={u.role}
                            onChange={(e) => changeRole(u._id, e.target.value)}
                            className="px-2 py-1 border border-slate-300 rounded-md bg-white/70 backdrop-blur-md text-slate-800"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          {u.blocked ? (
                            <button
                              className="px-2 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                              onClick={() => blockUnblockUser(u._id, false)}
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              onClick={() => blockUnblockUser(u._id, true)}
                            >
                              Block
                            </button>
                          )}
                        </div>
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
          ? "bg-cyan-600 text-white shadow-sm"
          : "hover:bg-cyan-100 text-cyan-700"
      }`}
    >
      {label}
    </button>
  );
}
