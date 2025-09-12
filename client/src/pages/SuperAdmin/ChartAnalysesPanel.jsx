import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../utils/api";

export default function ChartAnalysesPanel() {
  const { user } = useContext(AuthContext);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartTypeFilter, setChartTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
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

  const filteredAnalyses = analyses.filter((a) => {
    const matchesType = chartTypeFilter ? a.chartType === chartTypeFilter : true;
    const matchesDate = dateFilter
      ? new Date(a.createdAt).toISOString().slice(0, 10) === dateFilter
      : true;
    return matchesType && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-slate-800 font-inter">
      {/* 🔝 Topbar */}
      <div className="sticky top-0 z-20 bg-white/30 backdrop-blur-md shadow-md border-b border-cyan-100">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <img
              src="/logo2.png"
              alt="ExcelLense Logo"
              className="h-10 w-10 object-contain rounded-md shadow-md"
            />
            <h1 className="text-2xl font-bold text-cyan-700">ExcelLense</h1>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 tracking-wide">
              📊 Chart Analyses Panel
            </h2>
          </div>
        </div>
      </div>

      {/* 🧭 Navigation Bar */}
      <nav className="bg-white/60 backdrop-blur-md text-slate-700 shadow-md px-6 py-3 flex flex-wrap gap-4 font-medium border-b border-white/30">
        <NavButton label="Dashboard" path="/dashboard" />
        <NavButton label="Admin Panel" path="/admin" />
        <NavButton label="Admin Requests" path="/superadmin" />
        <NavButton label="Uploads records" path="/admin/upload-records" />
        <NavButton label="Analyses History" path="/admin/chart-analyses" active />
        <NavButton label="User Management" path="/admin/users/manage" />
      </nav>

      {/* 📄 Main Content */}
      <div className="px-6 py-10 max-w-screen-xl mx-auto">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/30 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-700">
            📊 Chart Analyses History
          </h2>

          {/* 🔍 Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={chartTypeFilter}
              onChange={(e) => setChartTypeFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-md bg-white/70 backdrop-blur-md text-slate-800 shadow-sm"
            >
              <option value="">All Chart Types</option>
              {[...new Set(analyses.map((a) => a.chartType))].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-md bg-white/70 backdrop-blur-md text-slate-800 shadow-sm"
            />
          </div>

          {/* 📊 Table */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-cyan-100 h-6 rounded-md w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredAnalyses.length === 0 ? (
            <p className="text-slate-500">No chart analyses found.</p>
          ) : (
            <table className="min-w-full border border-slate-500 border-collapse rounded-lg overflow-hidden shadow-md">

              <thead className="bg-white/70 backdrop-blur-md text-slate-700 sticky top-0 z-10">
                <tr className="border-b border-slate-300">
                  <th className="border-r border-slate-300 px-4 py-2 text-left">Upload ID</th>
                  <th className="border-r border-slate-300 px-4 py-2 text-left">User Email</th>
                  <th className="border-r border-slate-300 px-4 py-2 text-left">Chart Type</th>
                  <th className="border-r border-slate-300 px-4 py-2 text-left">X Axis</th>
                  <th className="border-r border-slate-300 px-4 py-2 text-left">Y Axis</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalyses.map((a, i) => (
                  <tr
                    key={a._id}
                    className={`border-b border-slate-300 ${
                      i % 2 === 0 ? "bg-white/60" : "bg-blue-50"
                    } hover:bg-white/80 transition`}
                  >
                    <td className="border-r border-slate-300 px-4 py-2 break-words">{a.uploadId}</td>
                    <td className="border-r border-slate-300 px-4 py-2 text-sm text-slate-700">
                      {a.userEmail || "—"}
                    </td>
                    <td className="border-r border-slate-300 px-4 py-2 capitalize">{a.chartType}</td>
                    <td className="border-r border-slate-300 px-4 py-2">{a.xAxis}</td>
                    <td className="border-r border-slate-300 px-4 py-2">{a.yAxis}</td>
                    <td className="px-4 py-2">{new Date(a.createdAt).toLocaleString()}</td>
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
