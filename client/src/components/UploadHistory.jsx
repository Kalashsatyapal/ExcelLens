import React, { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash, FaHome, FaSignOutAlt } from "react-icons/fa";
export default function UploadHistory() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await API.get("/uploads");
        setUploads(res.data);
      } catch (err) {
        alert("Failed to fetch upload history");
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this upload?")) return;
    try {
      await API.delete(`/uploads/${id}`);
      setUploads((prev) => prev.filter((upload) => upload._id !== id));
      if (previewData?._id === id) {
        setPreviewData(null);
        setPreviewIndex(null);
      }
    } catch (err) {
      alert("Failed to delete upload");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-800/60 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <img
              src="/logo2.png"
              alt="ExcelLense Logo"
              className="w-14 h-14 object-contain transition-transform hover:scale-105"
              loading="lazy"
            />
            <h1 className="text-3xl font-bold text-cyan-400 tracking-wide">
              ExcelLense
            </h1>
          </div>
          <nav className="space-x-4 flex items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-cyan-500 text-cyan-300 rounded-md hover:bg-slate-600 transition"
            >
              <FaHome /> Dashboard
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-red-500 text-red-300 rounded-md hover:bg-slate-600 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-10">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-slate-300 mb-8 tracking-tight">
          Upload History
        </h2>

        {loading ? (
          <div className="text-center text-slate-400 animate-pulse text-lg">
            Loading uploads...
          </div>
        ) : uploads.length === 0 ? (
          <div className="text-center text-slate-400 text-lg">No uploads found.</div>
        ) : (
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-xl border border-slate-700 shadow-lg overflow-hidden">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-slate-800/60 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 border-b border-slate-700 font-semibold text-slate-300">Filename</th>
                  <th className="px-6 py-4 border-b border-slate-700 font-semibold text-slate-300">Uploaded At</th>
                  <th className="px-6 py-4 border-b border-slate-700 text-center font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload, idx) => (
                  <React.Fragment key={upload._id}>
                    <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-cyan-300 hover:text-cyan-200 cursor-pointer"
                        onClick={() => {
                          setPreviewData(upload);
                          setPreviewIndex(idx);
                        }}
                      >
                        {upload.filename}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(upload.uploadedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => {
                              setPreviewData(upload);
                              setPreviewIndex(idx);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 text-cyan-300 border border-cyan-500 rounded hover:bg-slate-600 transition text-xs"
                          >
                            <FaEye /> Preview
                          </button>
                          <button
                            onClick={() => handleDelete(upload._id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 text-red-300 border border-red-500 rounded hover:bg-slate-600 transition text-xs"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Preview Panel */}
                    {previewData?._id === upload._id && previewIndex === idx && (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 bg-slate-800/60">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-xl font-semibold text-cyan-300">
                                Preview: {previewData.filename}
                              </h3>
                              <button
                                onClick={() => {
                                  setPreviewData(null);
                                  setPreviewIndex(null);
                                }}
                                className="px-3 py-1.5 bg-slate-700/50 text-red-300 border border-red-500 rounded hover:bg-slate-600 transition text-xs"
                              >
                                Close Preview
                              </button>
                            </div>
                            
                            {previewData.data.length === 0 ? (
                              <p className="text-slate-400">No data available.</p>
                            ) : (
                              <div className="overflow-auto max-h-[40vh] rounded-lg border border-slate-700">
                                <table className="min-w-full text-sm border-collapse">
                                  <thead className="bg-slate-800/80 sticky top-0">
                                    <tr>
                                      {Object.keys(previewData.data[0]).map((header) => (
                                        <th key={header} className="px-4 py-3 border-b border-slate-700 font-medium text-slate-300 text-left">
                                          {header}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {previewData.data.slice(0, 10).map((row, i) => (
                                      <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                        {Object.values(row).map((val, j) => (
                                          <td key={j} className="px-4 py-3 text-slate-300">
                                            {val}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                            {previewData.data.length > 10 && (
                              <p className="text-xs text-slate-400">Showing first 10 rows</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 py-6 border-t border-slate-700">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}