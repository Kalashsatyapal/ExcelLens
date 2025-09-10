import React, { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-emerald-50 text-gray-800 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img src="/src/assets/logo2.png" alt="Logo" className="h-10 w-auto rounded-md shadow-sm" />
          <h1 className="text-3xl font-extrabold tracking-tight text-emerald-700">ExcelLense</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-md hover:bg-indigo-200 transition"
          >
            Dashboard
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-600 font-semibold rounded-md hover:from-red-200 hover:to-red-300 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 space-y-10 flex-grow">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">Upload History</h1>

        {loading ? (
          <div className="text-center text-gray-500 animate-pulse text-lg">Loading uploads...</div>
        ) : uploads.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No uploads found.</div>
        ) : (
          <div className="overflow-auto max-h-[75vh] rounded-xl shadow border border-gray-200 bg-white">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-300 font-semibold text-gray-700">Filename</th>
                  <th className="px-4 py-3 border-b border-gray-300 font-semibold text-gray-700">Uploaded At</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload, idx) => (
                  <React.Fragment key={upload._id}>
                    <tr className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td
                        className="px-4 py-2 border-b border-gray-200 text-emerald-700 font-medium hover:underline cursor-pointer"
                        onClick={() => {
                          setPreviewData(upload);
                          setPreviewIndex(idx);
                        }}
                      >
                        {upload.filename}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 text-gray-600">
                        {new Date(upload.uploadedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setPreviewData(upload);
                              setPreviewIndex(idx);
                            }}
                            className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleDelete(upload._id)}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline Preview */}
                    {previewData?._id === upload._id && previewIndex === idx && (
                      <tr className="bg-emerald-50 animate-fade-in">
                        <td colSpan={3} className="px-6 py-4 border-t border-emerald-200">
                          <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-emerald-700">
                              Preview: {previewData.filename}
                            </h2>
                            <button
                              onClick={() => {
                                setPreviewData(null);
                                setPreviewIndex(null);
                              }}
                              className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                            >
                              Close Preview
                            </button>
                          </div>
                          {previewData.data.length === 0 ? (
                            <p className="text-gray-500">No data available.</p>
                          ) : (
                            <div className="overflow-auto max-h-[40vh] border border-gray-200 rounded">
                              <table className="min-w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-100">
                                  <tr>
                                    {Object.keys(previewData.data[0]).map((header) => (
                                      <th key={header} className="px-3 py-2 border-b border-gray-300 font-medium text-gray-700">
                                        {header}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {previewData.data.slice(0, 10).map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                      {Object.values(row).map((val, j) => (
                                        <td key={j} className="px-3 py-2 border-b border-gray-200 text-gray-700">
                                          {val}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {previewData.data.length > 10 && (
                                <p className="mt-2 text-xs text-gray-500">Showing first 10 rows</p>
                              )}
                            </div>
                          )}
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
      <footer className="bg-gray-50 py-6 mt-auto">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-emerald-600">ExcelLense</span>. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
