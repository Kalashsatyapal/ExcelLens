import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import Chart2D from "./Chart2D";
import Chart3D from "./Chart3D";
import ChartDownload from "./ChartDownload";

export default function DataVisualization() {
  const [uploads, setUploads] = useState([]);
  const [selectedUploadId, setSelectedUploadId] = useState("");
  const [selectedUpload, setSelectedUpload] = useState(null);

  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");

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
  }, [selectedUploadId, uploads]);

  const is3DChart = ["3d-column", "3d-pie"].includes(chartType);

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded shadow">
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
              <option key={u._id} value={u._id}>{u.filename}</option>
            ))}
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
              Object.keys(selectedUpload.data[0] || {}).map(k => (
                <option key={k} value={k}>{k}</option>
              ))
            }
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
              Object.keys(selectedUpload.data[0] || {}).map(k => (
                <option key={k} value={k}>{k}</option>
              ))
            }
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
      </div>

      {/* Chart Display */}
      <div className="border rounded p-4 min-h-[420px] bg-gray-50 flex justify-center items-center">
        {selectedUpload ? (
          is3DChart ? (
            <Chart3D selectedUpload={selectedUpload} xAxis={xAxis} yAxis={yAxis} chartType={chartType} />
          ) : (
            <Chart2D selectedUpload={selectedUpload} xAxis={xAxis} yAxis={yAxis} chartType={chartType} />
          )
        ) : (
          <p>Select a file and chart type</p>
        )}
      </div>

      {/* Download Buttons */}
      <ChartDownload
        selectedUpload={selectedUpload}
        xAxis={xAxis}
        yAxis={yAxis}
        chartType={chartType}
      />
    </div>
  );
}
