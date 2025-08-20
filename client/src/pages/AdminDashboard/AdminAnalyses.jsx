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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-white to-green-100 text-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* 🧭 Modern Header */}
        <div className="bg-white rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 mb-6 border border-green-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-green-700 tracking-tight">
              📊 Uploaded Chart Analyses
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Admin view of all saved chart summaries
            </p>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition"
          >
            ← Back to Admin Panel
          </button>
        </div>

        {/* 📊 Table */}
        {loading ? (
          <p className="text-green-600">Loading analyses...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : analyses.length === 0 ? (
          <p className="text-gray-600">No analyses found.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-sky-100">
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
                    <td className="border px-4 py-2 break-words">
                      {a.uploadId}
                    </td>
                    <td className="border px-4 py-2 text-sm text-gray-700">
                      {a.userEmail || "—"}
                    </td>
                    <td className="border px-4 py-2 capitalize">
                      {a.chartType}
                    </td>
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
          </div>
        )}
      </div>
    </div>
  );
}
