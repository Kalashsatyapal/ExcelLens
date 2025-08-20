import React, { useEffect, useState, useContext } from "react";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UploadHistory() {
  const { user } = useContext(AuthContext);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "admin" && !user?.isSuperAdmin) {
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
    <div className="min-h-screen bg-gradient-to-r from-white via-sky-100 to-green-100 text-gray-800">
      {/* Topbar */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-green-700">📁 Upload History</h1>
          <button
            onClick={() => navigate("/admin")}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-sky-600">Loading uploads...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : uploads.length === 0 ? (
          <p className="text-gray-600">No uploads found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
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
          </div>
        )}
      </div>
    </div>
  );
}
