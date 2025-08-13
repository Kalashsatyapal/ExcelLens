// src/components/DataVisualization.jsx
import React, { useEffect, useState, useRef } from 'react';
import API from '../../utils/api';

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
  const [selectedUploadId, setSelectedUploadId] = useState('');
  const [selectedUpload, setSelectedUpload] = useState(null);

  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');

  const chartContainerRef = useRef(null); // Chart.js container
  const threeContainerRef = useRef(null); // Three.js container

  // Three.js refs
  const threeSceneRef = useRef(null);
  const threeRendererRef = useRef(null);
  const threeCameraRef = useRef(null);
  const threeAnimationIdRef = useRef(null);

  // Fetch user uploads
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await API.get('/uploads');
        setUploads(res.data);
      } catch (error) {
        alert('Failed to fetch uploads');
      }
    };
    fetchUploads();
  }, []);

  // When selectedUploadId changes, update selectedUpload
  useEffect(() => {
    const upload = uploads.find((u) => u._id === selectedUploadId);
    setSelectedUpload(upload);
    setXAxis('');
    setYAxis('');
  }, [selectedUploadId, uploads]);

  // Helper: generate colors
  const generateColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(`hsl(${(i * 360) / num}, 70%, 50%)`);
    }
    return colors;
  };

  // Prepare Chart.js data object
  const getChartData = () => {
    if (!selectedUpload || !xAxis) return null;

    const rows = selectedUpload.data.filter(
      (row) =>
        row[xAxis] !== undefined &&
        row[xAxis] !== '' &&
        (chartType === 'pie' ? true : yAxis ? row[yAxis] !== undefined && row[yAxis] !== '' : false)
    );

    // labels for categories or x-values
    const labels = rows.map((r) => r[xAxis]);

    if (chartType === 'pie') {
      if (!yAxis) {
        // counts per label
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
        // pie with yAxis values (numeric)
        const data = rows.map((r) => Number(r[yAxis]) || 0);
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
    } else if (chartType === 'scatter') {
      // scatter requires numeric x,y pairs
      const scatterData = {
        datasets: [
          {
            label: yAxis || 'values',
            data: rows
              .map((r) => {
                const x = Number(r[xAxis]);
                const y = Number(r[yAxis]);
                if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
                return null;
              })
              .filter(Boolean),
            backgroundColor: 'rgba(75,192,192,1)',
          },
        ],
      };
      return scatterData;
    } else {
      // bar/line
      if (!yAxis) return null;
      const data = rows.map((r) => Number(r[yAxis]) || 0);
      return {
        labels,
        datasets: [
          {
            label: yAxis,
            data,
            backgroundColor: 'rgba(59,130,246,0.7)',
            borderColor: 'rgba(37,99,235,1)',
            borderWidth: 1,
            fill: chartType === 'line' ? false : true,
          },
        ],
      };
    }
  };

  // -------------------------------
  // THREE.JS: helpers for 3D charts
  // -------------------------------
  // cleanup three scene & renderer
  const cleanupThree = () => {
    if (threeAnimationIdRef.current) {
      cancelAnimationFrame(threeAnimationIdRef.current);
      threeAnimationIdRef.current = null;
    }
    if (threeRendererRef.current) {
      try {
        threeRendererRef.current.forceContextLoss?.();
        threeRendererRef.current.domElement?.remove();
        threeRendererRef.current.dispose();
      } catch (e) {
        // ignore
      }
      threeRendererRef.current = null;
    }
    if (threeSceneRef.current) {
      // traverse and dispose geometries/materials
      threeSceneRef.current.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose?.());
          } else obj.material.dispose?.();
        }
      });
      threeSceneRef.current = null;
    }
    threeCameraRef.current = null;
    if (threeContainerRef.current) threeContainerRef.current.innerHTML = '';
  };

  // Create 3D Column (already in your code) and 3D Pie
  useEffect(() => {
    // Only proceed for 3D chart types
    if (!selectedUpload || !xAxis) return;
    if (!['3d-column', '3d-pie'].includes(chartType)) {
      cleanupThree();
      return;
    }

    // Ensure container exists
    const container = threeContainerRef.current;
    if (!container) return;

    // Clear previous
    cleanupThree();

    const width = container.clientWidth || 800;
    const height = 400;

    // NOTE: preserveDrawingBuffer is set to true so canvas.toDataURL() can capture WebGL content
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);
    threeRendererRef.current = renderer;

    const scene = new THREE.Scene();
    threeSceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 12, 30);
    threeCameraRef.current = camera;

    // lights
    const amb = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(20, 40, 10);
    scene.add(dir);

    // grid or ground for reference
    const grid = new THREE.GridHelper(60, 30, 0x888888, 0x444444);
    scene.add(grid);

    // Prepare data grouped by X label
    const filteredRows = selectedUpload.data.filter((row) => row[xAxis] !== undefined && row[xAxis] !== '');
    const groups = {};
    filteredRows.forEach((r) => {
      const key = r[xAxis];
      const value = yAxis ? Number(r[yAxis]) || 0 : 1; // if no yAxis count as 1
      groups[key] = (groups[key] || 0) + value;
    });

    const labels = Object.keys(groups);
    const values = labels.map((l) => groups[l]);
    const colors = generateColors(labels.length);

    if (chartType === '3d-column') {
      // columns
      const maxVal = Math.max(...values, 1);
      const scale = 8 / maxVal;
      labels.forEach((label, idx) => {
        const val = values[idx];
        const height = val * scale;
        const geometry = new THREE.BoxGeometry(1.2, Math.max(0.1, height), 1.2);
        const material = new THREE.MeshPhongMaterial({ color: colors[idx] });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(idx * 1.6 - (labels.length - 1) * 0.8, (Math.max(0.1, height) / 2), 0);
        scene.add(mesh);
      });
    } else if (chartType === '3d-pie') {
      // 3D pie: create wedge shapes extruded
      const total = values.reduce((a, b) => a + b, 0) || 1;
      const radius = Math.min(8, Math.max(3, labels.length)); // radius adaptively
      let startAngle = 0;
      const extrudeSettings = { depth: 1.2, bevelEnabled: false, steps: 1 };
      labels.forEach((label, idx) => {
        const angle = (values[idx] / total) * Math.PI * 2;
        const endAngle = startAngle + angle;

        // Create wedge shape
        const shape = new THREE.Shape();
        // center
        shape.moveTo(0, 0);
        // outer arc approximation using absarc
        shape.absarc(0, 0, radius, startAngle, endAngle, false);
        // return to center (closing)
        shape.lineTo(0, 0);

        // Extrude to give thickness
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        // Because shape is in XY plane, we rotate so top faces up (Y -> Z)
        geom.rotateX(Math.PI / 2);

        // Move wedge slightly outward for separation (offset along bisector)
        const bisector = startAngle + angle / 2;
        const offset = 0.12 * (idx % 2 === 0 ? 1 : 1); // slight offset
        geom.translate(Math.cos(bisector) * offset, 0, Math.sin(bisector) * offset);

        const material = new THREE.MeshPhongMaterial({ color: colors[idx], shininess: 50 });
        const mesh = new THREE.Mesh(geom, material);
        // put center of pie near origin; extrudeGeometry's origin may be slightly off; adjust Y position
        mesh.position.y = 1.5; // lift above grid a bit

        scene.add(mesh);

        // Add small label sprites (optional simple text via canvas texture)
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.font = '18px sans-serif';
        ctx.fillText(`${label} (${Math.round((values[idx] / total) * 100)}%)`, 10, 30);

        const tex = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: tex, depthTest: false });
        const sprite = new THREE.Sprite(spriteMaterial);
        const labelDistance = radius + 1.6;
        sprite.position.set(Math.cos(bisector) * labelDistance, 2.6, Math.sin(bisector) * labelDistance);
        sprite.scale.set(4, 1, 1);
        scene.add(sprite);

        startAngle = endAngle;
      });

      // Slightly raise and rotate camera to view pie nicely
      camera.position.set(0, 12, 20);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    // Animation loop
    const animate = () => {
      threeAnimationIdRef.current = requestAnimationFrame(animate);
      // rotate scene slowly
      scene.rotation.y += 0.006;
      renderer.render(scene, camera);
    };
    animate();

    // save refs
    threeSceneRef.current = scene;
    threeCameraRef.current = camera;

    // handle resize
    const onResize = () => {
      const w = container.clientWidth || width;
      const h = height;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // cleanup on effect teardown
    return () => {
      window.removeEventListener('resize', onResize);
      cleanupThree();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUpload, xAxis, yAxis, chartType]);

  // Render Chart.js component
  const renderChartJS = () => {
    const data = getChartData();
    if (!data) return <p className="text-red-600">Select valid file and axes for this chart type</p>;

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { enabled: true },
      },
    };

    switch (chartType) {
      case 'bar':
        return <div style={{ height: 400 }}><Bar data={data} options={commonOptions} /></div>;
      case 'line':
        return <div style={{ height: 400 }}><Line data={data} options={commonOptions} /></div>;
      case 'pie':
        return <div style={{ height: 400 }}><Pie data={data} options={commonOptions} /></div>;
      case 'scatter':
        return <div style={{ height: 400 }}><Scatter data={data} options={commonOptions} /></div>;
      default:
        return <p>Chart type not supported for Chart.js</p>;
    }
  };

  // Download chart as PNG or PDF (supports Chart.js canvas & Three.js canvas)
  const downloadChart = async (type = 'png') => {
    let canvas = null;

    // Chart.js case
    if (['bar', 'line', 'pie', 'scatter'].includes(chartType)) {
      canvas = chartContainerRef.current?.querySelector('canvas');
    } else if (['3d-column', '3d-pie'].includes(chartType)) {
      // three.js case - renderer.domElement is the canvas
      canvas = threeContainerRef.current?.querySelector('canvas');
    }

    if (!canvas) {
      alert('No chart available to download');
      return;
    }

    // For PNG
    if (type === 'png') {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `chart_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    // For PDF - use canvas image put into jsPDF
    if (type === 'pdf') {
      const imgData = canvas.toDataURL('image/png', 1.0);
      // create pdf with same orientation as canvas
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`chart_${Date.now()}.pdf`);
      return;
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
            <option value="3d-pie">3D Pie</option>
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div className="border rounded p-4 min-h-[420px] bg-gray-50 flex justify-center items-center">
        {['bar', 'line', 'pie', 'scatter'].includes(chartType) ? (
          <div ref={chartContainerRef} className="w-full max-w-4xl" style={{ height: 420 }}>
            {renderChartJS()}
          </div>
        ) : ['3d-column', '3d-pie'].includes(chartType) ? (
          <div ref={threeContainerRef} className="w-full max-w-4xl h-[420px]" />
        ) : (
          <p>Select a chart type</p>
        )}
      </div>

      {/* Download buttons */}
      <div className="mt-4 space-x-4 text-center">
        <button
          onClick={() => downloadChart('png')}
          disabled={!selectedUpload || !xAxis}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Download PNG
        </button>
        <button
          onClick={() => downloadChart('pdf')}
          disabled={!selectedUpload || !xAxis}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
