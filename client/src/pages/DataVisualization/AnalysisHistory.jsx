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

  // ...existing code until return statement...

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-800/60 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <img src="/logo2.png" alt="Logo" className="w-14 h-14 object-contain transition-transform hover:scale-105" />
            <h1 className="text-3xl font-bold text-cyan-400 tracking-wide">ExcelLense</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/dashboard")} 
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-cyan-500 text-cyan-300 rounded-md hover:bg-slate-600 transition"
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate("/visualize")} 
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-indigo-500 text-indigo-300 rounded-md hover:bg-slate-600 transition"
            >
              Back to Visualization
            </button>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-md border border-red-500 text-red-300 rounded-md hover:bg-red-500/30 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10 flex-grow">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-slate-300">
          Analysis History
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400"></div>
          </div>
        ) : fetchError ? (
          <div className="text-red-400 flex items-center gap-2 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            <span>⚠️</span> <span>{fetchError}</span>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center text-slate-400">No analyses found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((a) => (
              <div key={a._id} className="group p-5 bg-slate-800/40 backdrop-blur-lg rounded-xl border border-slate-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ring-1 ring-transparent hover:ring-cyan-400 hover:ring-offset-2 hover:ring-offset-slate-900">
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400 mb-2">{a.chartType}</h2>
                  <p className="text-sm text-slate-300 mb-1">
                    <span className="font-medium text-indigo-400">X:</span> {a.xAxis} | 
                    <span className="font-medium text-indigo-400"> Y:</span> {a.yAxis}
                  </p>
                  <p className="text-sm text-slate-400 italic mb-3">{a.summary}</p>
                  <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-800/50 mb-4">
                    <img src={a.chartImageBase64} alt="Chart Preview" className="w-full h-48 object-contain" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <button 
                    onClick={() => downloadImage(a.chartImageBase64, a._id, "png")} 
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500 px-4 py-1.5 rounded-md text-sm font-medium transition"
                  >
                    PNG
                  </button>
                  <button 
                    onClick={() => downloadPDF(a.chartImageBase64, a._id)} 
                    className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500 px-4 py-1.5 rounded-md text-sm font-medium transition"
                  >
                    PDF
                  </button>
                  <button 
                    onClick={() => handleDelete(a._id)} 
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500 px-4 py-1.5 rounded-md text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteStatus && (
          <div className="text-sm mt-4 text-right text-slate-400 italic transition-opacity duration-500">
            {deleteStatus}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 py-6 border-t border-slate-700">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} <span className="font-semibold text-cyan-400">ExcelLense</span>. Built with precision and passion.
        </div>
      </footer>
    </div>
    );
  }