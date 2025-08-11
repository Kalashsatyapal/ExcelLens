import React, { useEffect, useState, useRef } from "react";
import API from "../../utils/api";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  ScatterController,
  BarController,
  PieController,
  LineController,
} from "chart.js";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";

// Three.js imports
import * as THREE from "three";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  ScatterController,
  BarController,
  PieController,
  LineController
);

export default function DataVisualization() {
  const [uploads, setUploads] = useState([]);
  const [selectedUploadId, setSelectedUploadId] = useState("");
  const [selectedUpload, setSelectedUpload] = useState(null);

  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");

  const chartContainerRef = useRef(null);
  const threeContainerRef = useRef(null);

  // For 3D chart rendering
  const threeSceneRef = React.useRef();
  const threeRendererRef = React.useRef();
  const threeCameraRef = React.useRef();

  // Fetch user uploads
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

  // When selectedUploadId changes, update selectedUpload
  useEffect(() => {
    const upload = uploads.find((u) => u._id === selectedUploadId);
    setSelectedUpload(upload);
    setXAxis("");
    setYAxis("");
  }, [selectedUploadId, uploads]);

  // Prepare Chart.js data object
  const getChartData = () => {
    if (!selectedUpload || !xAxis) return null;

    // Filter out rows where x or y is empty
    const filteredRows = selectedUpload.data.filter(
      (row) =>
        row[xAxis] !== undefined &&
        row[xAxis] !== "" &&
        (yAxis ? row[yAxis] !== undefined && row[yAxis] !== "" : true)
    );

    const labels = filteredRows.map((row) => row[xAxis]);

    let datasets = [];

    if (chartType === "pie") {
      // Pie needs labels & data, data from yAxis or count of labels if no yAxis selected
      if (!yAxis) {
        // Pie based on count of unique xAxis labels
        const counts = {};
        labels.forEach((l) => (counts[l] = (counts[l] || 0) + 1));
        return {
          labels: Object.keys(counts),
          datasets: [
            {
              data: Object.values(counts),
              backgroundColor: generateColors(Object.keys(counts).length),
            },
          ],
        };
      } else {
        // Pie based on yAxis values (assumed numeric)
        const data = filteredRows.map((row) => Number(row[yAxis]) || 0);
        return {
          labels,
          datasets: [
            {
              data,
              backgroundColor: generateColors(labels.length),
            },
          ],
        };
      }
    } else {
      // For bar, line, scatter: one dataset with yAxis values
      if (!yAxis) return null;
      const data = filteredRows.map((row) => Number(row[yAxis]) || 0);
      datasets = [
        {
          label: yAxis,
          data,
          backgroundColor: "rgba(59, 130, 246, 0.7)", // blue
          borderColor: "rgba(37, 99, 235, 1)",
          borderWidth: 1,
          fill: chartType === "line" ? false : true,
          showLine: chartType === "line",
          pointRadius: chartType === "scatter" ? 5 : 0,
          type: chartType === "scatter" ? "scatter" : undefined,
        },
      ];
      return { labels, datasets };
    }
  };

  // Generate distinct colors for pie slices
  const generateColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(`hsl(${(i * 360) / num}, 70%, 60%)`);
    }
    return colors;
  };

  // 3D Chart using Three.js - only implementing 3D column chart for demo
 useEffect(() => {
    if (!selectedUpload || !xAxis || !yAxis || !threeContainerRef.current)
      return;

    if (!["3d-column"].includes(chartType)) return;

    // Clean previous scene
    if (threeRendererRef.current) {
      threeRendererRef.current.dispose();
      threeContainerRef.current.innerHTML = "";
    }

    // Setup scene, camera, renderer
    const width = threeContainerRef.current.clientWidth;
    const height = 400;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 5, 0); // Make camera look at the center

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(width, height);
    threeContainerRef.current.appendChild(renderer.domElement);

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    scene.add(light);

    // Floor grid
    const gridHelper = new THREE.GridHelper(40, 20);
    scene.add(gridHelper);

    // Data for columns
    const filteredRows = selectedUpload.data.filter(
      (row) => row[xAxis] !== undefined && row[yAxis] !== undefined
    );
    const labels = [...new Set(filteredRows.map((row) => row[xAxis]))];
    const values = labels.map((label) => {
      // Aggregate values for label (sum)
      const sum = filteredRows
        .filter((row) => row[xAxis] === label)
        .reduce((acc, cur) => acc + (Number(cur[yAxis]) || 0), 0);
      return sum;
    });

    // Create a group for bars
    const barsGroup = new THREE.Group();

    // Create bars (columns)
    const maxVal = Math.max(...values);
    const scale = 10 / (maxVal || 1);

    labels.forEach((label, idx) => {
      const height = values[idx] * scale;
      const geometry = new THREE.BoxGeometry(1, height, 1);
      const material = new THREE.MeshPhongMaterial({
        color: `hsl(${(idx * 360) / labels.length}, 70%, 50%)`,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(idx * 1.5 - labels.length / 2, height / 2, 0);
      barsGroup.add(cube);
    });

    scene.add(barsGroup);

    // Animate function
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      // barsGroup.rotation.y += 0.005; // Rotate bars, not the whole scene
      renderer.render(scene, camera);
    };
    animate();

    threeSceneRef.current = scene;
    threeRendererRef.current = renderer;
    threeCameraRef.current = camera;

    // Cleanup on unmount or rerender
    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (renderer.domElement) renderer.domElement.remove();
      scene.clear();
    };
  }, [selectedUpload, xAxis, yAxis, chartType]);

  // Render Chart.js chart component based on type
  const renderChartJS = () => {
    const data = getChartData();
    if (!data)
      return (
        <p className="text-red-600">
          Select valid file and axes for this chart type
        </p>
      );

    const commonOptions = {
      responsive: true,
      plugins: {
        legend: { display: true, position: "top" },
        tooltip: { enabled: true },
      },
    };

    switch (chartType) {
      case "bar":
        return <Bar data={data} options={commonOptions} />;
      case "line":
        return <Line data={data} options={commonOptions} />;
      case "pie":
        return <Pie data={data} options={commonOptions} />;
      case "scatter":
        // Scatter needs different data format, transform data accordingly
        const scatterData = {
          datasets: [
            {
              label: yAxis,
              data: selectedUpload.data
                .filter(
                  (row) => row[xAxis] !== undefined && row[yAxis] !== undefined
                )
                .map((row) => ({
                  x: Number(row[xAxis]),
                  y: Number(row[yAxis]),
                })),
              backgroundColor: "rgba(75, 192, 192, 1)",
            },
          ],
        };
        return <Scatter data={scatterData} options={commonOptions} />;
      default:
        return <p>Chart type not supported.</p>;
    }
  };

  // Download chart as PNG or PDF
  const downloadChart = async (type = "png") => {
    let canvas;

    if (["bar", "line", "pie", "scatter"].includes(chartType)) {
      // Chart.js chart canvas is inside chartContainerRef div
      canvas = chartContainerRef.current.querySelector("canvas");
      if (!canvas) {
        alert("No chart available to download");
        return;
      }
      if (type === "png") {
        const link = document.createElement("a");
        link.download = `chart_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else if (type === "pdf") {
        const canvasImage = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(canvasImage, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`chart_${Date.now()}.pdf`);
      }
    } else if (chartType === "3d-column") {
      // Get the Three.js renderer's canvas directly
      const renderer = threeRendererRef.current;
      if (!renderer || !renderer.domElement) {
        alert("No chart available to download");
        return;
      }
      const threeCanvas = renderer.domElement;
      if (type === "png") {
        const link = document.createElement("a");
        link.download = `chart_${Date.now()}.png`;
        link.href = threeCanvas.toDataURL("image/png");
        link.click();
      } else if (type === "pdf") {
        const imgData = threeCanvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [threeCanvas.width, threeCanvas.height],
        });
        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          threeCanvas.width,
          threeCanvas.height
        );
        pdf.save(`chart_${Date.now()}.pdf`);
      }
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Data Visualization</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Upload File Selector */}
        <div>
          <label className="block font-medium mb-1">Select Excel File</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedUploadId}
            onChange={(e) => setSelectedUploadId(e.target.value)}
          >
            <option value="">-- Select file --</option>
            {uploads.map((upload) => (
              <option key={upload._id} value={upload._id}>
                {upload.filename}
              </option>
            ))}
          </select>
        </div>

        {/* X Axis Selector */}
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
              Object.keys(selectedUpload.data[0] || {}).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
          </select>
        </div>

        {/* Y Axis Selector */}
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
              Object.keys(selectedUpload.data[0] || {}).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
          </select>
        </div>

        {/* Chart Type Selector */}
        <div>
          <label className="block font-medium mb-1">Chart Type</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            disabled={!selectedUpload}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="scatter">Scatter</option>
            <option value="3d-column">3D Column</option>
            {/* You can add more 3D chart types here */}
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div className="border rounded p-4 min-h-[400px] bg-gray-50 flex justify-center items-center">
        {["bar", "line", "pie", "scatter"].includes(chartType) ? (
          <div ref={chartContainerRef} className="w-full max-w-4xl">
            {renderChartJS()}
          </div>
        ) : chartType === "3d-column" ? (
          <div ref={threeContainerRef} className="w-full max-w-4xl h-[400px]" />
        ) : (
          <p>Select a chart type</p>
        )}
      </div>

      {/* Download buttons */}
      <div className="mt-4 space-x-4 text-center">
        <button
          onClick={() => downloadChart("png")}
          disabled={!selectedUpload || !xAxis || !yAxis}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Download PNG
        </button>
        <button
          onClick={() => downloadChart("pdf")}
          disabled={!selectedUpload || !xAxis || !yAxis}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
