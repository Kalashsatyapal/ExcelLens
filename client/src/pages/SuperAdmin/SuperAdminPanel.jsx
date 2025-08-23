import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../utils/api";

export default function SuperAdminPanel() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("pending");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/admin/admin-requests?status=${view}`);
      setRequests(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load requests");
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await API.post(`/admin/admin-requests/${id}/approve`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Approval failed");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason (optional):");
    try {
      await API.post(`/admin/admin-requests/${id}/reject`, { reason });
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Rejection failed");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [view]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-pink-600 text-white">
      {/* Topbar */}
      <header className="w-full px-6 py-4 flex items-center justify-between bg-purple-800 shadow-md">
        <h2 className="text-2xl font-bold tracking-wide">Super Admin Panel</h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden sm:inline">
            {user?.username} <span className="opacity-70">({user?.role})</span>
          </span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-md text-xs font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white text-purple-700 shadow-md px-6 py-3 flex flex-wrap gap-4 justify-start font-medium">
        <NavButton label="Dashboard" path="/dashboard" />
        <NavButton label="Admin Panel" path="/admin" />
        <NavButton label="Admin Requests" path="/superadmin" active />
        <NavButton label="Upload Records" path="/admin/upload-records" />
        <NavButton label="Analyses History" path="/admin/chart-analyses" />
        <NavButton label="User Management" path="/admin/users/manage" />
      </nav>

      {/* Main Content */}
      <div className="px-6 py-10">
        <div className="bg-white text-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Admin Requests</h1>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            {["pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setView(status)}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  view === status
                    ? "bg-green-600 text-white"
                    : "bg-white text-green-600 hover:bg-green-100"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Request List */}
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-green-600 font-medium">
              No {view} requests
            </p>
          ) : (
            <ul className="space-y-6">
              {requests.map((req) => (
                <li key={req._id} className="bg-sky-100 p-4 rounded-lg shadow-md">
                  <p><strong>Username:</strong> {req.username}</p>
                  <p><strong>Email:</strong> {req.email}</p>
                  <p><strong>Requested At:</strong> {new Date(req.createdAt).toLocaleString()}</p>

                  {view === "rejected" && req.rejectionReason && (
                    <p className="mt-2 text-sm text-red-600">
                      <strong>Reason:</strong> {req.rejectionReason}
                    </p>
                  )}

                  {view === "pending" && (
                    <div className="mt-4 flex gap-4">
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
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
