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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-slate-800 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/30 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center border-b border-cyan-100">
        <div className="flex items-center gap-4">
          <img src="/src/assets/logo2.png" alt="Logo" className="h-10 w-auto rounded-md shadow-sm" />
          <h1 className="text-2xl font-bold tracking-tight text-cyan-700">ExcelLense</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 font-medium rounded-md hover:from-cyan-200 hover:to-blue-200 transition">Dashboard</button>
          <button onClick={() => navigate("/visualize")} className="px-4 py-2 bg-white/40 backdrop-blur-md border border-blue-300 text-blue-700 font-medium rounded-md hover:bg-white/60 transition">Back to Visualization</button>
          <button onClick={logout} className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-600 font-medium rounded-md hover:from-red-200 hover:to-red-300 transition">Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 space-y-10 flex-grow">
        <h1 className="text-3xl font-bold text-cyan-700">Analysis History</h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-600"></div>
          </div>
        ) : fetchError ? (
          <div className="text-red-600 flex items-center gap-2">
            <span>⚠️</span> <span>{fetchError}</span>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center text-slate-500">No analyses found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((a) => (
              <div key={a._id} className="bg-white/60 backdrop-blur-md border border-white/30 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-cyan-700 mb-2">{a.chartType}</h2>
                  <p className="text-sm text-slate-700 mb-1">
                    <span className="font-medium">X:</span> {a.xAxis} | <span className="font-medium">Y:</span> {a.yAxis}
                  </p>
                  <p className="text-sm text-slate-600 italic mb-3">{a.summary}</p>
                  <div className="rounded overflow-hidden border bg-white mb-4">
                    <img src={a.chartImageBase64} alt="Chart Preview" className="w-full h-48 object-contain" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <button onClick={() => downloadImage(a.chartImageBase64, a._id, "png")} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition">PNG</button>
                  <button onClick={() => downloadPDF(a.chartImageBase64, a._id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition">PDF</button>
                  <button onClick={() => handleDelete(a._id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteStatus && (
          <div className="text-sm mt-4 text-right text-slate-500 italic transition-opacity duration-500">
            {deleteStatus}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-100 to-cyan-100 py-6 mt-auto border-t border-gray-200">
        <div className="container mx-auto text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} <span className="font-semibold text-cyan-700">ExcelLense</span>. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
