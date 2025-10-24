import React, { useState, useEffect, useContext } from "react";
import API from "../../utils/api";
import Chart2D from "./Chart2D";
import Chart3D from "./Chart3D";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import jsPDF from "jspdf";

export default function DataVisualization() {
  const [uploads, setUploads] = useState([]);
  const [selectedUploadId, setSelectedUploadId] = useState("");
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [saveStatus, setSaveStatus] = useState("");
  const [chartImageBase64, setChartImageBase64] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const currentUserEmail = user?.email;

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await API.get("/uploads");
        setUploads(res.data);
      } catch (error) {
        alert("Failed to fetch uploads");
      }
    };
    fetchUploads();
  }, []);

  useEffect(() => {
    const upload = uploads.find((u) => u._id === selectedUploadId);
    setSelectedUpload(upload);
    setXAxis("");
    setYAxis("");
    setSaveStatus("");
    setChartImageBase64("");
  }, [selectedUploadId, uploads]);

  const is3DChart = ["3d-column", "3d-pie"].includes(chartType);

  useEffect(() => {
    const autoSaveAnalysis = async () => {
      if (!selectedUpload || !xAxis || !yAxis) return;
      try {
        const canvas = document.querySelector("canvas");
        const imageBase64 = canvas?.toDataURL("image/png") || "";
        setChartImageBase64(imageBase64);
        await API.post("/chart-analysis", {
          userEmail: currentUserEmail,
          uploadId: selectedUpload._id,
          chartType,
          xAxis,
          yAxis,
          chartImageBase64: imageBase64,
        });
        setSaveStatus("✅ Analysis saved successfully.");
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSaveStatus("⚠️ Failed to save analysis.");
      }
    };
    const timeout = setTimeout(autoSaveAnalysis, 500);
    return () => clearTimeout(timeout);
  }, [selectedUpload, xAxis, yAxis, chartType]);

  const handleDownloadPNG = () => {
    if (!chartImageBase64) return;
    const link = document.createElement("a");
    link.href = chartImageBase64;
    link.download = "chart.png";
    link.click();
  };

  const handleDownloadPDF = () => {
    if (!chartImageBase64) return;
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const img = new Image();
    img.src = chartImageBase64;
    img.onload = () => {
      const scaleRatio = Math.min(pageWidth / img.width, pageHeight / img.height);
      const scaledWidth = img.width * scaleRatio;
      const scaledHeight = img.height * scaleRatio;
      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;
      pdf.addImage(chartImageBase64, "PNG", x, y, scaledWidth, scaledHeight);
      pdf.save("chart.pdf");
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-slate-800 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/30 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center border-b border-cyan-100">
        <div className="flex items-center gap-4">
          <img src="/logo2.png" alt="Logo" className="h-10 w-auto rounded-md shadow-sm" />
          <h1 className="text-2xl font-bold tracking-tight text-cyan-700">ExcelLense</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded hover:scale-105 transition shadow-sm">
            Dashboard
          </button>
          <button onClick={() => navigate("/analysis-history")} className="px-4 py-2 bg-white/40 backdrop-blur-md border border-blue-300 text-blue-700 rounded hover:bg-white/60 transition shadow-sm">
            History
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 space-y-8">
        <h2 className="text-3xl font-bold text-cyan-700">📊 Data Visualization</h2>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block font-semibold mb-2">📁 Select Excel File</label>
            <select className="w-full border rounded px-3 py-2 bg-white/70 backdrop-blur-md border-cyan-200 text-slate-800" value={selectedUploadId} onChange={(e) => setSelectedUploadId(e.target.value)}>
              <option value="">-- Select file --</option>
              {uploads.map((u) => (
                <option key={u._id} value={u._id}>{u.filename}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">📐 Chart Type</label>
            <select className="w-full border rounded px-3 py-2 bg-white/70 backdrop-blur-md border-cyan-200 text-slate-800" value={chartType} onChange={(e) => setChartType(e.target.value)} disabled={!selectedUpload}>
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
              <option value="scatter">Scatter</option>
              <option value="3d-column">3D Column</option>
              <option value="3d-pie">3D Pie</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">🧭 X Axis</label>
            <select className="w-full border rounded px-3 py-2 bg-white/70 backdrop-blur-md border-cyan-200 text-slate-800" value={xAxis} onChange={(e) => setXAxis(e.target.value)} disabled={!selectedUpload}>
              <option value="">-- Select X Axis --</option>
              {selectedUpload && Object.keys(selectedUpload.data[0] || {}).map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">📏 Y Axis</label>
            <select className="w-full border rounded px-3 py-2 bg-white/70 backdrop-blur-md border-cyan-200 text-slate-800" value={yAxis} onChange={(e) => setYAxis(e.target.value)} disabled={!selectedUpload}>
              <option value="">-- Select Y Axis --</option>
              {selectedUpload && Object.keys(selectedUpload.data[0] || {}).map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart Display */}
        <div className="border rounded-lg p-6 bg-white/60 backdrop-blur-md min-h-[400px] flex justify-center items-center shadow">
          {selectedUpload ? (
            is3DChart ? (
              <Chart3D selectedUpload={selectedUpload} xAxis={xAxis} yAxis={yAxis} chartType={chartType} />
            ) : (
              <Chart2D selectedUpload={selectedUpload} xAxis={xAxis} yAxis={yAxis} chartType={chartType} />
            )
          ) : (
            <p className="text-slate-500 italic">Select a file and chart type to begin.</p>
          )}
        </div>

        {/* Status + Downloads */}
        {saveStatus && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
            <p className="text-sm text-slate-600 italic">{saveStatus}</p>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPNG}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded shadow transition"
              >
                ⬇️ Download PNG
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded shadow transition"
              >
                ⬇️ Download PDF
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-100 to-cyan-100 py-6 mt-auto border-t border-gray-200">
        <div className="container mx-auto text-center text-slate-500 text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-cyan-700">ExcelLense</span>. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
