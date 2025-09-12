import React, { useEffect, useState, useContext } from "react";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminAnalyses() {
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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-slate-800 font-inter">
      {/* 🌟 Topbar */}
      <div className="sticky top-0 z-10 bg-white/30 backdrop-blur-md shadow-md border-b border-cyan-100">
        <div className="max-w-screen-xl mx-auto px-6 py-4 space-y-2">
          {/* 🔷 Logo and Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/logo2.png"
                alt="Admin Logo"
                className="h-14 w-14 object-contain drop-shadow-sm"
              />
              <h1 className="text-3xl font-bold tracking-wide text-cyan-700">
                ExcelLense
              </h1>
            </div>
          </div>

          {/* 👤 User Info + Page Title + Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
              <h6 className="text-2xl font-bold text-blue-600">
                📊 Chart Analyses
              </h6>
              <p className="text-sm text-slate-600 mt-1 sm:mt-0">
                Logged in as{" "}
                <span className="font-medium text-slate-800">
                  {user?.username}
                </span>{" "}
                (
                <span className="capitalize text-cyan-600">{user?.role}</span>
                )
              </p>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 font-semibold rounded-md hover:from-cyan-200 hover:to-blue-200 transition"
            >
              Go to Admin Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* 📄 Main Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-cyan-600 animate-pulse">Loading analyses...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : analyses.length === 0 ? (
          <p className="text-slate-500">No analyses found.</p>
        ) : (
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/30 overflow-x-auto">
            <table className="min-w-full border-collapse border border-slate-300">
              <thead className="bg-white/70 backdrop-blur-md text-slate-700">
                <tr>
                  <th className="border px-4 py-2 text-left">Upload ID</th>
                  <th className="border px-4 py-2 text-left">User Email</th>
                  <th className="border px-4 py-2 text-left">Chart Type</th>
                  <th className="border px-4 py-2 text-left">X Axis</th>
                  <th className="border px-4 py-2 text-left">Y Axis</th>
                  <th className="border px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((a) => (
                  <tr key={a._id} className="hover:bg-white/80 transition">
                    <td className="border px-4 py-2 break-words">{a.uploadId}</td>
                    <td className="border px-4 py-2 text-sm text-slate-700">
                      {a.userEmail || "—"}
                    </td>
                    <td className="border px-4 py-2 capitalize">{a.chartType}</td>
                    <td className="border px-4 py-2">{a.xAxis}</td>
                    <td className="border px-4 py-2">{a.yAxis}</td>
                    <td className="border px-4 py-2">
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
