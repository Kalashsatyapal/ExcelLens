import React, { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState("");
  const [fetchError, setFetchError] = useState("");
  const hasFetched = useRef(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const currentUserEmail = user?.email;

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAnalyses = async () => {
      try {
        if (!currentUserEmail) {
          setFetchError("⚠️ User not authenticated.");
          setLoading(false);
          return;
        }

        const res = await API.get(`/chart-analysis/user/${currentUserEmail}`);
        const uniqueAnalyses = deduplicateAnalyses(res.data);
        setAnalyses(uniqueAnalyses);
      } catch (error) {
        console.error("Failed to fetch analysis history:", error);
        setFetchError("⚠️ Unable to load analysis history.");
      } finally {
        setLoading(false);
      }
    };

    const deduplicateAnalyses = (data) => {
      const seen = new Set();
      return data.filter((a) => {
        const key = `${a.chartType}-${a.xAxis}-${a.yAxis}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };

    fetchAnalyses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/chart-analysis/${id}`);
      setAnalyses((prev) => prev.filter((a) => a._id !== id));
      setDeleteStatus("✅ Deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteStatus("⚠️ Failed to delete analysis.");
    } finally {
      setTimeout(() => setDeleteStatus(""), 3000);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-green-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm px-6 py-5 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src="/src/assets/logo2.png"
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
            onClick={() => navigate("/visualize")}
            className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200 transition"
          >
            Back to Visualization
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
      <main className="container mx-auto px-6 py-10 space-y-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-green-800">
          Analysis History
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : fetchError ? (
          <p className="text-red-600">{fetchError}</p>
        ) : analyses.length === 0 ? (
          <p>No analyses found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((a) => (
              <div
                key={a._id}
                className="border rounded-md p-4 shadow bg-white"
              >
                <h2 className="font-semibold text-lg mb-2 text-green-700">
                  {a.chartType}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>X:</strong> {a.xAxis} | <strong>Y:</strong> {a.yAxis}
                </p>
                <p className="text-sm text-gray-600 mb-2 italic">{a.summary}</p>
                <img
                  src={a.chartImageBase64}
                  alt="Chart Preview"
                  className="w-full h-48 object-contain bg-white border mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      downloadImage(a.chartImageBase64, a._id, "png")
                    }
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
