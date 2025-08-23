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
  const [view, setView] = useState("pending"); // 'pending' | 'approved' | 'rejected'

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
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-pink-600 text-white flex flex-col">
      {/* Topbar */}
      <header className="w-full px-6 py-4 bg-white/10 backdrop-blur-md flex items-center justify-between shadow-md">
        <h2 className="text-xl font-bold tracking-wide">Super Admin Panel</h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden sm:inline">
            {user?.username} <span className="opacity-70">({user?.role})</span>
          </span>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
          >
            User Dashboard
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Admin Panel
          </button>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-md text-xs font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-10">
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
                <li
                  key={req._id}
                  className="bg-sky-100 p-4 rounded-lg shadow-md"
                >
                  <p>
                    <strong>Username:</strong> {req.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {req.email}
                  </p>
                  <p>
                    <strong>Requested At:</strong>{" "}
                    {new Date(req.createdAt).toLocaleString()}
                  </p>

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
      </main>
    </div>
  );
}
