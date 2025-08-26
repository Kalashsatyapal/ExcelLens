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
    // 🔐 Explicit role check
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-purple-50 text-gray-800">
      {/* 🌟 Topbar */}
      <div className="sticky top-0 z-10 bg-white shadow-md border-b border-purple-200">
        <div className="max-w-screen-xl mx-auto px-6 py-4 space-y-2">
          {/* 🔷 Logo and Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/logo2.png"
                alt="Admin Logo"
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-2xl font-bold tracking-tight text-green-700">
                ExcelLense
              </h1>
            </div>
          </div>

          {/* 👤 User Info + Page Title + Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
              <h6 className="text-2xl font-bold text-purple-700">
                📊 Chart Analyses
              </h6>
              <p className="text-sm text-gray-600 mt-1 sm:mt-0">
                Logged in as{" "}
                <span className="font-medium text-gray-800">
                  {user?.username}
                </span>{" "}
                (
                <span className="capitalize text-purple-600">{user?.role}</span>
                )
              </p>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 font-semibold rounded-md hover:from-purple-200 hover:to-purple-300 transition"
            >
              Go to Admin Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* 📄 Main Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-purple-600">Loading analyses...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : analyses.length === 0 ? (
          <p className="text-gray-600">No analyses found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-purple-100 text-purple-800">
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
                  <tr key={a._id} className="hover:bg-purple-50">
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
          </div>
        )}
      </div>
    </div>
  );
}
