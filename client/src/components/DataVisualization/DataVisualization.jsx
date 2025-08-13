import React, { useEffect, useState, useRef } from 'react';
import API from '../utils/api';

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
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

// Three.js imports
import * as THREE from 'three';

import { jsPDF } from 'jspdf';

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
  const [selectedUploadId, setSelectedUploadId] = useState('');
  const [selectedUpload, setSelectedUpload] = useState(null);

  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');

  const chartContainerRef = useRef(null);
  const threeContainerRef = useRef(null);

  const threeSceneRef = React.useRef();
  const threeRendererRef = React.useRef();
  const threeCameraRef = React.useRef();

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await API.get('/uploads');
        setUploads(res.data);
      } catch {
        alert('Failed to fetch uploads');
      }
    };
    fetchUploads();
  }, []);

  useEffect(() => {
    const upload = uploads.find((u) => u._id === selectedUploadId);
    setSelectedUpload(upload || null);
    setXAxis('');
    setYAxis('');
  }, [selectedUploadId, uploads]);

  const getChartData = () => {
    if (!selectedUpload || !xAxis) return null;

    const filteredRows = selectedUpload.data.filter(row =>
      row[xAxis] !== undefined && row[xAxis] !== '' &&
      (yAxis ? row[yAxis] !== undefined && row[yAxis] !== '' : true)
    );
    const labels = filteredRows.map(row => row[xAxis]);

    if (chartType === 'pie') {
      if (!yAxis) {
        const counts = {};
        labels.forEach(l => counts[l] = (counts[l] || 0) + 1);
        return {
          labels: Object.keys(counts),
          datasets: [{ data: Object.values(counts), backgroundColor: genColors(Object.keys(counts).length) }]
        };
      } else {
        const data = filteredRows.map(row => Number(row[yAxis]) || 0);
        return {
          labels,
          datasets: [{ data, backgroundColor: genColors(labels.length) }]
        };
      }
    } else {
      if (!yAxis) return null;
      const data = filteredRows.map(row => Number(row[yAxis]) || 0);
      return {
        labels,
        datasets: [{
          label: yAxis,
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 1,
          fill: chartType === 'line' ? false : true,
          showLine: chartType === 'line',
          pointRadius: chartType === 'scatter' ? 5 : 0,
          type: chartType === 'scatter' ? 'scatter' : undefined,
        }]
      };
    }
  };

  const genColors = (n) => Array.from({ length: n }, (_, i) => `hsl(${(i * 360) / n}, 70%, 60%)`);

  useEffect(() => {
    if (!selectedUpload || !xAxis || !yAxis || !threeContainerRef.current) return;
    if (chartType !== '3d-column') return;

    if (threeRendererRef.current) {
      threeRendererRef.current.dispose();
      threeContainerRef.current.innerHTML = '';
    }

    const width = threeContainerRef.current.clientWidth;
    const height = 400;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 10, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    // preserveDrawingBuffer=true is important so we can export the canvas
    renderer.setSize(width, height);
    threeContainerRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    scene.add(light);

    const gridHelper = new THREE.GridHelper(40, 20);
    scene.add(gridHelper);

    const filteredRows = selectedUpload.data.filter(row => row[xAxis] !== undefined && row[yAxis] !== undefined);
    const labels = [...new Set(filteredRows.map(row => row[xAxis]))];
    const values = labels.map(label =>
      filteredRows.filter(row => row[xAxis] === label).reduce((acc, cur) => acc + (Number(cur[yAxis]) || 0), 0)
    );

    const maxVal = Math.max(...values);
    const scale = 10 / (maxVal || 1);

    labels.forEach((label, idx) => {
      const h = values[idx] * scale;
      const geom = new THREE.BoxGeometry(1, h, 1);
      const mat = new THREE.MeshPhongMaterial({ color: `hsl(${(idx * 360) / labels.length}, 70%, 50%)` });
      const cube = new THREE.Mesh(geom, mat);
      cube.position.set(idx * 1.5 - (labels.length / 2), h / 2, 0);
      scene.add(cube);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      scene.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    threeSceneRef.current = scene;
    threeRendererRef.current = renderer;
    threeCameraRef.current = camera;

    return () => {
      renderer.dispose();
      if (renderer.domElement) renderer.domElement.remove();
      scene.clear();
    };
  }, [selectedUpload, xAxis, yAxis, chartType]);

  const renderChartJS = () => {
    const data = getChartData();
    if (!data) return <p className="text-red-600">Select valid file and axes for this chart type</p>;

    const commonOptions = {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { enabled: true },
      },
    };

    switch (chartType) {
      case 'bar': return <Bar data={data} options={commonOptions} />;
      case 'line': return <Line data={data} options={commonOptions} />;
      case 'pie': return <Pie data={data} options={commonOptions} />;
      case 'scatter': {
        const scatterData = {
          datasets: [{
            label: yAxis,
            data: (selectedUpload?.data || [])
              .filter(row => row[xAxis] !== undefined && row[yAxis] !== undefined)
              .map(row => ({ x: Number(row[xAxis]), y: Number(row[yAxis]) })),
          }],
        };
        return <Scatter data={scatterData} options={commonOptions} />;
      }
      default: return <p>Chart type not supported.</p>;
    }
  };

  const downloadChart = async (type = 'png') => {
    const { canvas, mimeType } = getActiveCanvasAndMime(type);
    if (!canvas) return alert('No chart available to download');

    if (type === 'png') {
      const link = document.createElement('a');
      link.download = `chart_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      const img = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`chart_${Date.now()}.pdf`);
    }
  };

  const getActiveCanvasAndMime = (type = 'png') => {
    let canvas = null;
    if (['bar', 'line', 'pie', 'scatter'].includes(chartType)) {
      canvas = chartContainerRef.current?.querySelector('canvas');
    } else if (chartType === '3d-column') {
      canvas = threeContainerRef.current?.querySelector('canvas');
    }
    return { canvas, mimeType: type === 'png' ? 'image/png' : 'application/pdf' };
  };

  const saveChartToDB = async (type = 'png') => {
    if (!selectedUpload || !xAxis || !yAxis) {
      return alert('Pick a file, X axis and Y axis first.');
    }

    const { canvas, mimeType } = getActiveCanvasAndMime(type);
    if (!canvas) return alert('No chart available to save');

    try {
      const fileName = `chart_${chartType}_${Date.now()}.${type === 'png' ? 'png' : 'pdf'}`;

      let blob;
      if (type === 'png') {
        blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));
      } else {
        // For PDF, render PNG then embed in PDF (client-side), then upload that PDF blob
        const img = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
        pdf.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height);
        blob = pdf.output('blob'); // PDF blob
      }

      const form = new FormData();
      form.append('file', new File([blob], fileName, { type: mimeType }));
      form.append('uploadId', selectedUpload._id);
      form.append('chartType', chartType);
      form.append('xAxis', xAxis);
      form.append('yAxis', yAxis);
      form.append('options', JSON.stringify({}));

      const res = await API.post('/charts', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Chart saved successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save chart');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Data Visualization</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

        <div>
          <label className="block font-medium mb-1">X Axis</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            disabled={!selectedUpload}
          >
            <option value="">-- Select X Axis --</option>
            {selectedUpload && Object.keys(selectedUpload.data[0] || {}).map((key) => (
              <option key={key} value={key}>{key}</option>
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
            {selectedUpload && Object.keys(selectedUpload.data[0] || {}).map((key) => (
              <option key={key} value={key}>{key}</option>
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
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="scatter">Scatter</option>
            <option value="3d-column">3D Column</option>
          </select>
        </div>
      </div>

      <div className="border rounded p-4 min-h-[400px] bg-gray-50 flex justify-center items-center">
        {['bar', 'line', 'pie', 'scatter'].includes(chartType) ? (
          <div ref={chartContainerRef} className="w-full max-w-4xl">
            {renderChartJS()}
          </div>
        ) : chartType === '3d-column' ? (
          <div ref={threeContainerRef} className="w-full max-w-4xl h-[400px]" />
        ) : (
          <p>Select a chart type</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => downloadChart('png')}
          disabled={!selectedUpload || !xAxis || !yAxis}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Download PNG
        </button>
        <button
          onClick={() => downloadChart('pdf')}
          disabled={!selectedUpload || !xAxis || !yAxis}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Download PDF
        </button>
        <button
          onClick={() => saveChartToDB('png')}
          disabled={!selectedUpload || !xAxis || !yAxis}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Save to Library (PNG)
        </button>
        <button
          onClick={() => saveChartToDB('pdf')}
          disabled={!selectedUpload || !xAxis || !yAxis}
          className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
        >
          Save to Library (PDF)
        </button>
      </div>
    </div>
  );
}
