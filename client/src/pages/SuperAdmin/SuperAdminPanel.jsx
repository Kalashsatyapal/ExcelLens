import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";

export default function SuperAdminPanel() {
  const { user, logout } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("pending");
  const navigate = useNavigate();

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
      toast.success("Request approved");
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason (optional):");
    try {
      await API.post(`/admin/admin-requests/${id}/reject`, { reason });
      toast.success("Request rejected");
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Rejection failed");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [view]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-slate-800 font-inter">
      <Toaster position="top-right" />

      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-white/30 backdrop-blur-md shadow-md border-b border-cyan-100">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/logo2.png"
              alt="ExcelLense Logo"
              className="h-10 w-10 rounded-md shadow-md"
            />
            <h1 className="text-2xl font-extrabold tracking-tight text-cyan-700">
              ExcelLense
            </h1>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-600">
            🛡️ Super Admin Panel
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-md text-slate-700 shadow-md px-6 py-3 flex flex-wrap gap-4 font-medium border-b border-white/30">
        <NavButton label="Dashboard" path="/dashboard" />
        <NavButton label="Admin Panel" path="/admin" />
        <NavButton label="Admin Requests" path="/superadmin" active />
        <NavButton label="Upload Records" path="/admin/upload-records" />
        <NavButton label="Analyses History" path="/admin/chart-analyses" />
        <NavButton label="User Management" path="/admin/users/manage" />
      </nav>

      {/* Main */}
      <div className="px-6 py-10">
        <div className="bg-white/60 backdrop-blur-md text-slate-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto border border-white/30">
          <h1 className="text-3xl font-bold mb-6 text-center text-cyan-700">
            Admin Requests
          </h1>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-6 border-b border-slate-300">
            {["pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setView(status)}
                className={`relative px-4 py-2 font-semibold transition ${
                  view === status
                    ? "text-cyan-700"
                    : "text-slate-500 hover:text-cyan-600"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {view === status && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 rounded-t-md" />
                )}
              </button>
            ))}
          </div>

          {/* Request List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-cyan-100 h-20 rounded-lg"
                />
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-cyan-600 font-medium">
              No {view} requests
            </p>
          ) : (
            <ul className="space-y-6">
              {requests.map((req) => (
                <RequestCard
                  key={req._id}
                  req={req}
                  view={view}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// 🔹 NavButton Component
function NavButton({ label, path, active }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className={`px-4 py-2 rounded-md transition ${
        active
          ? "bg-cyan-600 text-white"
          : "hover:bg-cyan-100 text-cyan-700"
      }`}
    >
      {label}
    </button>
  );
}

// 🔸 RequestCard Component
function RequestCard({ req, view, onApprove, onReject }) {
  return (
    <li className="bg-white/70 backdrop-blur-md p-4 rounded-lg shadow-md hover:shadow-xl hover:bg-white transition duration-200 border border-white/30">
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
            onClick={() => onApprove(req._id)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(req._id)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Reject
          </button>
        </div>
      )}
    </li>
  );
}
