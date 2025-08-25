import React, { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UploadHistory() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState(null);
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
      if (previewData?._id === id) setPreviewData(null);
    } catch (err) {
      alert("Failed to delete upload");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-green-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm px-6 py-5 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="h-10 w-auto rounded-md shadow-sm"
          />
          <h1 className="text-2xl font-bold tracking-tight text-green-700">
            ExcelLense
          </h1>
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
      <main className="container mx-auto px-6 py-10 space-y-8">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Upload History</h1>

        {loading ? (
          <p>Loading...</p>
        ) : uploads.length === 0 ? (
          <p>No uploads found.</p>
        ) : (
          <div className="flex gap-6">
            {/* Upload List */}
            <div className="w-1/3 overflow-y-auto max-h-[70vh] border rounded-md bg-white p-4 shadow">
              <ul>
                {uploads.map((upload) => (
                  <li key={upload._id} className="mb-4 border-b pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{upload.filename}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(upload.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => setPreviewData(upload)}
                          className="text-indigo-600 hover:underline text-sm"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleDelete(upload._id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preview */}
            <div className="flex-1 bg-white rounded-md shadow p-4 overflow-auto max-h-[70vh]">
              {previewData ? (
                <>
                  <h2 className="text-xl font-semibold mb-4 text-green-700">
                    Preview: {previewData.filename}
                  </h2>
                  {previewData.data.length === 0 ? (
                    <p>No data available.</p>
                  ) : (
                    <table className="table-auto border-collapse w-full text-left text-sm">
                      <thead>
                        <tr>
                          {Object.keys(previewData.data[0]).map((header) => (
                            <th
                              key={header}
                              className="border border-gray-300 px-2 py-1 bg-gray-100"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.data.slice(0, 10).map((row, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            {Object.values(row).map((val, i) => (
                              <td
                                key={i}
                                className="border border-gray-300 px-2 py-1"
                              >
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {previewData.data.length > 10 && (
                    <p className="mt-2 text-xs text-gray-500">
                      Showing first 10 rows
                    </p>
                  )}
                </>
              ) : (
                <p>Select a file to preview.</p>
              )}
            </div>
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
