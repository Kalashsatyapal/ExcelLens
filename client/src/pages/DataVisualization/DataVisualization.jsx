import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import Chart2D from "./Chart2D";
import Chart3D from "./Chart3D";
import ChartSummary from "./ChartSummary";
import { Link } from "react-router-dom";
export default function DataVisualization() {
  const [uploads, setUploads] = useState([]);
  const [selectedUploadId, setSelectedUploadId] = useState("");
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [chartSummary, setChartSummary] = useState(""); // ✅ lifted summary
  const [saveStatus, setSaveStatus] = useState(""); // ✅ status line

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
  }, [selectedUploadId, uploads]);

  const is3DChart = ["3d-column", "3d-pie"].includes(chartType);

  // ✅ Auto-save when summary is ready
  useEffect(() => {
    const autoSaveAnalysis = async () => {
      if (!selectedUpload || !xAxis || !yAxis || !chartSummary) return;

      try {
        const canvas = document.querySelector("canvas");
        const chartImageBase64 = canvas?.toDataURL("image/png") || "";

        await API.post("/chart-analysis", {
          uploadId: selectedUpload._id,
          chartType,
          xAxis,
          yAxis,
          summary: chartSummary,
          chartImageBase64,
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

  return (
    <div className="w-screen p-4 bg-white rounded shadow">
      {/* Header with Dashboard Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">
          📊 Data Visualization Tool
        </h1>
        <Link
          to="/analysis-history"
          className="inline-block px-4 py-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-gray-800 font-medium rounded-md border border-gray-300 hover:from-gray-300 hover:via-gray-400 hover:to-gray-500 transition duration-200 ml-4"
        >
          View Analysis History
        </Link>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow"
        >
          Go to Dashboard
        </button>
      </div>
      <h2 className="text-2xl font-semibold mb-6">Data Visualization</h2>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        <div>
          <label className="block font-medium mb-1">Chart Type</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            disabled={!selectedUpload}
          >
            <option value="bar">Bar(text vs integer)</option>
            <option value="line">Line(text vs integer)</option>
            <option value="pie">Pie(text vs integer)</option>
            <option value="scatter">Scatter(integer vs integer)</option>
            <option value="3d-column">3D Column(text vs integer)</option>
            <option value="3d-pie">3D Pie(text vs integer)</option>
          </select>
        </div>
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

      {/* Chart Display */}
      <div className="border rounded p-4 min-h-[420px] bg-gray-50 flex justify-center items-center">
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
          <p>Select a file and chart type</p>
        )}
      </div>

      {/* Chart Summary */}
      <ChartSummary
        chartType={chartType}
        xAxis={xAxis}
        yAxis={yAxis}
        setChartSummary={setChartSummary}
      />

      {/* Save Status Line */}
      {saveStatus && (
        <p className="text-sm mt-2 text-right text-gray-600 italic">
          {saveStatus}
        </p>
      )}
    </div>
  );
}
