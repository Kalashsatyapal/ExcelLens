import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../utils/api";

export default function UploadRecordsPanel() {
  const { user } = useContext(AuthContext);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!["admin", "superadmin"].includes(user?.role)) {
      console.warn(`Unauthorized access attempt by role: ${user?.role}`);
      navigate("/dashboard");
      return;
    }

    const fetchUploads = async () => {
      try {
        const res = await API.get("/admin/uploads");
        setUploads(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load uploads");
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-slate-800 font-inter">
      {/* 🔝 Topbar */}
      <div className="sticky top-0 z-20 bg-white/30 backdrop-blur-md shadow-md border-b border-cyan-100">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between relative">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logo2.png"
              alt="ExcelLense Logo"
              className="h-10 w-10 object-contain rounded-md shadow-md"
            />
            <h1 className="text-2xl font-bold text-cyan-700">ExcelLense</h1>
          </div>

          {/* Centered Heading */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 tracking-wide">
              📁 Upload Records Panel
            </h2>
          </div>
        </div>
      </div>

      {/* 🧭 Navigation Bar */}
      <nav className="bg-white/60 backdrop-blur-md text-slate-700 shadow-md px-6 py-3 flex flex-wrap gap-4 font-medium border-b border-white/30">
        <NavButton label="Dashboard" path="/dashboard" />
        <NavButton label="Admin Panel" path="/admin" />
        <NavButton label="Admin Requests" path="/superadmin" />
        <NavButton label="Upload records" path="/admin/uploads" active />
        <NavButton label="Analyses History" path="/admin/chart-analyses" />
        <NavButton label="User Management" path="/admin/users/manage" />
      </nav>

      {/* 📄 Main Content */}
      <div className="px-6 py-10 max-w-screen-xl mx-auto">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/30 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4 text-cyan-700">
            📁 Upload History
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-cyan-100 h-6 rounded-md w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : uploads.length === 0 ? (
            <p className="text-slate-500">No uploads found.</p>
          ) : (
            <table className="min-w-full border border-slate-500 border-collapse rounded-lg shadow-md overflow-hidden">

              <thead className="bg-white/70 backdrop-blur-md text-slate-700">
                <tr>
                  <th className="border px-4 py-2 text-left">User</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Filename</th>
                  <th className="border px-4 py-2 text-left">Uploaded At</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload, i) => (
                  <tr
                    key={upload._id}
                    className={`${
                      i % 2 === 0 ? "bg-white/60" : "bg-blue-50"
                    } hover:bg-white/80 transition`}
                  >
                    <td className="border px-4 py-2">
                      {upload.user?.username || "Unknown"}
                    </td>
                    <td className="border px-4 py-2">
                      {upload.user?.email || "Unknown"}
                    </td>
                    <td className="border px-4 py-2 break-words max-w-xs">
                      {upload.filename}
                    </td>
                    <td className="border px-4 py-2">
                      {upload.uploadedAt
                        ? new Date(upload.uploadedAt).toLocaleString()
                        : "Unknown"}
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

// 🔹 NavButton Subcomponent
function NavButton({ label, path, active }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className={`px-4 py-2 rounded-md transition duration-200 ease-in-out ${
        active
          ? "bg-cyan-600 text-white shadow-sm"
          : "hover:bg-cyan-100 text-cyan-700"
      }`}
    >
      {label}
    </button>
  );
}
