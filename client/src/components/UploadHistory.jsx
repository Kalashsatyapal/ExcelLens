import React, { useEffect, useState } from 'react';
import API from '../utils/api';

export default function UploadHistory() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState(null);

  const fetchUploads = async () => {
    try {
      const res = await API.get('/uploads');
      setUploads(res.data);
    } catch (err) {
      alert('Failed to fetch upload history');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this upload?')) return;

    try {
      await API.delete(`/uploads/${id}`);
      setUploads((prev) => prev.filter((upload) => upload._id !== id));
      if (previewData?._id === id) setPreviewData(null);
    } catch (err) {
      alert('Failed to delete upload');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload History</h1>

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
                      <p className="text-xs text-gray-500">{new Date(upload.uploadedAt).toLocaleString()}</p>
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
                <h2 className="text-xl font-semibold mb-4">Preview: {previewData.filename}</h2>
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
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="border border-gray-300 px-2 py-1">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {previewData.data.length > 10 && <p className="mt-2 text-xs text-gray-500">Showing first 10 rows</p>}
              </>
            ) : (
              <p>Select a file to preview.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
