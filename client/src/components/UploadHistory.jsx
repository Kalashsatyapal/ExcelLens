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

  const fetchUploads = async () => {
    try {
      const res = await API.get("/uploads");
      setUploads(res.data);
    } catch (err) {
      alert("Failed to fetch upload history");
    }
    setLoading(false);
  };

  useEffect(() => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-green-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm px-6 py-5 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img src="/src/assets/logo2.png" alt="Logo" className="h-10 w-auto rounded-md shadow-sm" />
          <h1 className="text-2xl font-bold tracking-tight text-green-700">ExcelLense</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-md hover:bg-indigo-200 transition">Dashboard</button>
          <button onClick={logout} className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-600 font-semibold rounded-md hover:from-red-200 hover:to-red-300 transition">Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 space-y-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Upload History</h1>

        {loading ? (
          <p>Loading...</p>
        ) : uploads.length === 0 ? (
          <p>No uploads found.</p>
        ) : (
          <div className="overflow-auto max-h-[75vh]">
            <table className="table-auto w-full border-collapse text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Filename</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Uploaded At</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload, idx) => (
                  <React.Fragment key={upload._id}>
                    <tr className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border border-gray-300 px-3 py-2 text-green-700 font-medium hover:underline cursor-pointer" onClick={() => { setPreviewData(upload); setPreviewIndex(idx); }}>
                        {upload.filename}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-600">
                        {new Date(upload.uploadedAt).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => { setPreviewData(upload); setPreviewIndex(idx); }} title="Preview" className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition">
                            Preview
                          </button>
                          <button onClick={() => handleDelete(upload._id)} title="Delete" className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline Preview Row */}
                    {previewData?._id === upload._id && previewIndex === idx && (
                      <tr className="bg-green-50">
                        <td colSpan={3} className="border border-green-200 px-4 py-4">
                          <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold text-green-700">Preview: {previewData.filename}</h2>
                            <button onClick={() => { setPreviewData(null); setPreviewIndex(null); }} className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition">Close Preview</button>
                          </div>
                          {previewData.data.length === 0 ? (
                            <p>No data available.</p>
                          ) : (
                            <div className="overflow-auto max-h-[40vh]">
                              <table className="table-auto border-collapse w-full text-left text-sm">
                                <thead>
                                  <tr>
                                    {Object.keys(previewData.data[0]).map((header) => (
                                      <th key={header} className="border border-gray-300 px-2 py-1 bg-gray-100">{header}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {previewData.data.slice(0, 10).map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                      {Object.values(row).map((val, j) => (
                                        <td key={j} className="border border-gray-300 px-2 py-1">{val}</td>
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
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
