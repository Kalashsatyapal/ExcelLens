import React, { useEffect, useState } from 'react';
import API from '../utils/api';

export default function ChartLibrary() {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCharts = async () => {
    try {
      const res = await API.get('/charts');
      setCharts(res.data);
    } catch {
      alert('Failed to load charts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this chart?')) return;
    try {
      await API.delete(`/charts/${id}`);
      setCharts(prev => prev.filter(c => c._id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const openChart = (id, mimeType) => {
    // open in a new tab
    const a = document.createElement('a');
    a.href = `${API.defaults.baseURL}/charts/${id}/file`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.click();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Chart Library</h1>
      {loading ? (
        <p>Loading…</p>
      ) : charts.length === 0 ? (
        <p>No saved charts yet.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {charts.map((c) => (
            <li key={c._id} className="bg-white rounded shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{c.fileName}</p>
                  <p className="text-sm text-gray-500">
                    {c.chartType.toUpperCase()} | X: {c.xAxis} | Y: {c.yAxis}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded border">{c.mimeType}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => openChart(c._id, c.mimeType)}
                  className="px-3 py-1 text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  Preview/Download
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
