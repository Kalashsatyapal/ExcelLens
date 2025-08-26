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
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-sky-100 to-white text-gray-800">
      {/* Topbar */}
      <header className="w-full px-6 py-4 flex items-center justify-between bg-green-200 shadow-md">
        <h1 className="text-2xl font-bold text-green-800">Upload Records</h1>
        <button
          onClick={() => navigate("/superadmin")}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
        >
          Go to Superadmin Panel
        </button>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white text-green-700 shadow-md px-6 py-3 flex flex-wrap gap-4 justify-start font-medium">
        <NavButton label="Dashboard" path="/dashboard" />
        <NavButton label="Admin Panel" path="/admin" />
        <NavButton label="Admin Requests" path="/superadmin" />
        <NavButton label="Uploads" path="/admin/uploads" active />
        <NavButton label="Analyses History" path="/admin/chart-analyses" />
        <NavButton label="User Management" path="/admin/users/manage" />
      </nav>

      {/* Main Content */}
      <div className="px-6 py-10 max-w-screen-xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">📁 Upload History</h2>

          {loading ? (
            <p className="text-sky-600">Loading uploads...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : uploads.length === 0 ? (
            <p className="text-gray-600">No uploads found.</p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-green-100 text-green-800">
                <tr>
                  <th className="border px-4 py-2 text-left">User</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Filename</th>
                  <th className="border px-4 py-2 text-left">Uploaded At</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload) => (
                  <tr key={upload._id} className="hover:bg-sky-100">
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
      className={`px-4 py-2 rounded-md transition ${
        active
          ? "bg-green-600 text-white"
          : "hover:bg-green-100 text-green-700"
      }`}
    >
      {label}
    </button>
  );
}
