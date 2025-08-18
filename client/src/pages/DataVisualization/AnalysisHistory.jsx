import React, { useEffect, useState, useRef } from "react";
import API from "../../utils/api";

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState("");
  const [fetchError, setFetchError] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAnalyses = async () => {
      try {
        const res = await API.get("/chart-analysis");
        const uniqueAnalyses = deduplicateAnalyses(res.data);
        setAnalyses(uniqueAnalyses);
      } catch (error) {
        console.error("Failed to fetch analysis history:", error);
        setFetchError("⚠️ Unable to load analysis history.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, []);

  const deduplicateAnalyses = (data) => {
    const seen = new Set();
    return data.filter((a) => {
      const key = `${a.chartType}-${a.xAxis}-${a.yAxis}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/chart-analysis/${id}`);
      setAnalyses((prev) => prev.filter((a) => a._id !== id));
      setDeleteStatus("✅ Deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteStatus("⚠️ Failed to delete analysis.");
    } finally {
      setTimeout(() => setDeleteStatus(""), 3000); // Clear status after 3s
    }
  };

  const downloadImage = (base64, filename, format = "png") => {
    const link = document.createElement("a");
    link.href = base64;
    link.download = `${filename}.${format}`;
    link.click();
  };

  const downloadPDF = async (base64, filename) => {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    pdf.addImage(base64, "PNG", 15, 40, 180, 100);
    pdf.save(`${filename}.pdf`);
  };

  return (
    <div className="w-screen p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📁 Analysis History</h1>
        <button
          onClick={() => (window.location.href = "/visualize")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow"
        >
          Back to Visualization
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : fetchError ? (
        <p className="text-red-600">{fetchError}</p>
      ) : analyses.length === 0 ? (
        <p>No analyses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((a) => (
            <div key={a._id} className="border rounded p-4 shadow bg-gray-50">
              <h2 className="font-semibold text-lg mb-2">{a.chartType}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>X:</strong> {a.xAxis} | <strong>Y:</strong> {a.yAxis}
              </p>
              <p className="text-sm text-gray-600 mb-2 italic">{a.summary}</p>
              <img
                src={a.chartImageBase64}
                alt="Chart Preview"
                className="w-full h-48 object-contain bg-white border mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => downloadImage(a.chartImageBase64, a._id, "png")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  Download PNG
                </button>
                <button
                  onClick={() => downloadPDF(a.chartImageBase64, a._id)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteStatus && (
        <p className="text-sm mt-4 text-right text-gray-600 italic">
          {deleteStatus}
        </p>
      )}
    </div>
  );
}
