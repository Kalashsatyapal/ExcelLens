import React, { useState, useEffect, useContext } from "react";
import API from "../../utils/api";
import Chart2D from "./Chart2D";
import Chart3D from "./Chart3D";
import ChartSummary from "./ChartSummary";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import jsPDF from "jspdf";

export default function DataVisualization() {
  const [uploads, setUploads] = useState([]);
  const [selectedUploadId, setSelectedUploadId] = useState("");
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [chartSummary, setChartSummary] = useState("");
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
    setChartSummary("");
    setSaveStatus("");
    setChartImageBase64("");
  }, [selectedUploadId, uploads]);

  const is3DChart = ["3d-column", "3d-pie"].includes(chartType);

  useEffect(() => {
    const autoSaveAnalysis = async () => {
      if (!selectedUpload || !xAxis || !yAxis || !chartSummary) return;

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
          summary: chartSummary,
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
  }, [selectedUpload, xAxis, yAxis, chartType, chartSummary]);

  const handleDownloadPNG = () => {
    if (!chartImageBase64) return;
    const link = document.createElement("a");
    link.href = chartImageBase64;
    link.download = "chart.png";
    link.click();
  };

  const handleDownloadPDF = () => {
    if (!chartImageBase64) return;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const img = new Image();
    img.src = chartImageBase64;

    img.onload = () => {
      const scaleRatio = Math.min(
        pageWidth / img.width,
        pageHeight / img.height
      );
      const scaledWidth = img.width * scaleRatio;
      const scaledHeight = img.height * scaleRatio;
      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;

      pdf.addImage(chartImageBase64, "PNG", x, y, scaledWidth, scaledHeight);
      pdf.save("chart.pdf");
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-green-50 text-gray-800">
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
            onClick={() => navigate("/analysis-history")}
            className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200 transition"
          >
            Analysis History
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 space-y-8">
        <h2 className="text-3xl font-bold mb-6 text-green-800">
          Data Visualization
        </h2>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Upload Selector */}
          <div>
            <label className="block font-medium mb-1">Select Excel File</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedUploadId}
              onChange={(e) => setSelectedUploadId(e.target.value)}
            >
              <option value="">-- Select file --</option>
              {uploads.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.filename}
                </option>
              ))}
            </select>
          </div>

          {/* Chart Type */}
          <div>
            <label className="block font-medium mb-1">Chart Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              disabled={!selectedUpload}
            >
              <option value="bar">Bar (text vs integer)</option>
              <option value="line">Line (text vs integer)</option>
              <option value="pie">Pie (text vs integer)</option>
              <option value="scatter">Scatter (integer vs integer)</option>
              <option value="3d-column">3D Column (text vs integer)</option>
              <option value="3d-pie">3D Pie (text vs integer)</option>
            </select>
          </div>

          {/* X Axis */}
          <div>
            <label className="block font-medium mb-1">X Axis</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              disabled={!selectedUpload}
            >
              <option value="">-- Select X Axis --</option>
              {selectedUpload &&
                Object.keys(selectedUpload.data[0] || {}).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
            </select>
          </div>

          {/* Y Axis */}
          <div>
            <label className="block font-medium mb-1">Y Axis</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              disabled={!selectedUpload}
            >
              <option value="">-- Select Y Axis --</option>
              {selectedUpload &&
                Object.keys(selectedUpload.data[0] || {}).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Chart + Summary */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 border rounded p-4 min-h-[378px] bg-gray-50 flex justify-center items-center">
            {selectedUpload ? (
              is3DChart ? (
                <Chart3D
                  selectedUpload={selectedUpload}
                  xAxis={xAxis}
                  yAxis={yAxis}
                  chartType={chartType}
                />
              ) : (
                <Chart2D
                  selectedUpload={selectedUpload}
                  xAxis={xAxis}
                  yAxis={yAxis}
                  chartType={chartType}
                />
              )
            ) : (
              <p className="text-gray-500 italic">
                Select a file and chart type to begin.
              </p>
            )}
          </div>

          {/* Chart Summary */}
          <div className="md:w-[300px] w-full border rounded p-4 bg-gray-50">
            <ChartSummary
              chartType={chartType}
              xAxis={xAxis}
              yAxis={yAxis}
              setChartSummary={setChartSummary}
            />
          </div>
        </div>

        {/* Save Status + Download Buttons */}
        {saveStatus && (
          <div className="mt-4 flex flex-col md:flex-row justify-end items-center gap-3">
            <p className="text-sm text-gray-600 italic">{saveStatus}</p>
            <button
              onClick={handleDownloadPNG}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded shadow"
            >
              ⬇️ Download PNG
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded shadow"
            >
              ⬇️ Download PDF
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and
          passion.
        </div>
      </footer>
    </div>
  );
}
