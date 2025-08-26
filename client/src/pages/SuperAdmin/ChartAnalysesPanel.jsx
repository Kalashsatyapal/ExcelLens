import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../utils/api";

export default function ChartAnalysesPanel() {
  const { user } = useContext(AuthContext);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!["admin", "superadmin"].includes(user?.role)) {
      console.warn(`Unauthorized access attempt by role: ${user?.role}`);
      navigate("/dashboard");
      return;
    }

    const fetchAnalyses = async () => {
      try {
        const res = await API.get("/admin/analyses");
        setAnalyses(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analyses");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-100 via-white to-green-100 text-gray-800">
      {/* Topbar */}
      <header className="w-full px-6 py-4 flex items-center justify-between bg-sky-200 shadow-md">
        <h1 className="text-2xl font-bold text-sky-800">Chart Analyses</h1>
        <button
          onClick={() => navigate("/superadmin")}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md transition"
        >
          Go to Superadmin panel
        </button>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white text-sky-700 shadow-md px-6 py-3 flex flex-wrap gap-4 justify-start font-medium">
        <NavButton label="Dashboard" path="/dashboard" />
        <NavButton label="Admin Panel" path="/admin" />
        <NavButton label="Admin Requests" path="/superadmin" />
        <NavButton label="Uploads History" path="/admin/upload-records" />
        <NavButton label="Analyses History" path="/admin/chart-analyses" active />
        <NavButton label="User Management" path="/admin/users/manage" />
      </nav>

      {/* Main Content */}
      <div className="px-6 py-10 max-w-screen-xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4 text-sky-700">📊 Chart Analyses History</h2>

          {loading ? (
            <p className="text-green-600">Loading chart analyses...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : analyses.length === 0 ? (
            <p className="text-gray-600">No chart analyses found.</p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-sky-100 text-sky-800">
                <tr>
                  <th className="border px-4 py-2 text-left">Upload ID</th>
                  <th className="border px-4 py-2 text-left">User Email</th>
                  <th className="border px-4 py-2 text-left">Chart Type</th>
                  <th className="border px-4 py-2 text-left">X Axis</th>
                  <th className="border px-4 py-2 text-left">Y Axis</th>
                  <th className="border px-4 py-2 text-left">Summary</th>
                  <th className="border px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((a) => (
                  <tr key={a._id} className="hover:bg-green-50">
                    <td className="border px-4 py-2 break-words">{a.uploadId}</td>
                    <td className="border px-4 py-2 text-sm text-gray-700">
                      {a.userEmail || "—"}
                    </td>
                    <td className="border px-4 py-2 capitalize">{a.chartType}</td>
                    <td className="border px-4 py-2">{a.xAxis}</td>
                    <td className="border px-4 py-2">{a.yAxis}</td>
                    <td className="border px-4 py-2 max-w-xs">
                      <div className="overflow-x-auto whitespace-nowrap text-sm text-gray-700">
                        {a.summary}
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(a.createdAt).toLocaleString()}
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
          ? "bg-sky-600 text-white"
          : "hover:bg-sky-100 text-sky-700"
      }`}
    >
      {label}
    </button>
  );
}
