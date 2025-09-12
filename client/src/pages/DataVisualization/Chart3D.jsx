import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 🎨 Generate distinct HSL colors
const generateColors = (num) =>
  Array.from({ length: num }, (_, i) => `hsl(${(i * 360) / num}, 70%, 50%)`);

// 🔠 Abbreviate text into acronym
const abbreviateText = (text) => {
  if (!text || text.length < 3) return text;
  const words = text.trim().split(/\s+/);
  if (words.length === 1 && words[0].length < 3) return text;
  return words.map(word => word[0]?.toUpperCase() || "").join("");
};

// 🏷️ Create label sprite with glassmorphism styling
const createLabel = (text, color = "#111827") => {
  const size = 256;
  const scaleFactor = window.devicePixelRatio || 2;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size * scaleFactor;
  const ctx = canvas.getContext("2d");
  ctx.scale(scaleFactor, scaleFactor);

  ctx.clearRect(0, 0, size, size);

  const fontSize = 56;
  ctx.font = `bold ${fontSize}px Inter, Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const padding = 32;
  const boxWidth = textWidth + padding;
  const boxHeight = fontSize + padding / 2;
  const boxX = (size - boxWidth) / 2;
  const boxY = (size - boxHeight) / 2;
  const radius = 12;

  // Glassmorphism background
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(boxX + radius, boxY);
  ctx.lineTo(boxX + boxWidth - radius, boxY);
  ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + radius);
  ctx.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
  ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - radius, boxY + boxHeight);
  ctx.lineTo(boxX + radius, boxY + boxHeight);
  ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - radius);
  ctx.lineTo(boxX, boxY + radius);
  ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
  ctx.closePath();
  ctx.fill();

  // Text
  ctx.fillStyle = color;
  ctx.fillText(text, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4.2, 2.1, 1);
  sprite.renderOrder = 999;
  return sprite;
};

export default function Chart3D({ selectedUpload, xAxis, yAxis, chartType }) {
  const containerRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();

  useEffect(() => {
    if (!selectedUpload || !xAxis) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = 500;

    if (rendererRef.current) {
      rendererRef.current.forceContextLoss?.();
      rendererRef.current.domElement?.remove();
      rendererRef.current.dispose();
    }
    if (sceneRef.current) sceneRef.current.clear();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f9fafb");
    scene.fog = new THREE.Fog("#f9fafb", 20, 60);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 18, 34);
    camera.lookAt(0, 6, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 10;
    controls.maxDistance = 80;
    controls.target.set(0, 6, 0);
    controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.4));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(20, 40, 10);
    dir.castShadow = true;
    dir.shadow.mapSize.width = 1024;
    dir.shadow.mapSize.height = 1024;
    scene.add(dir);

    const grid = new THREE.GridHelper(60, 30, 0x888888, 0x444444);
    grid.position.y = 1.5;
    scene.add(grid);

    const rows = selectedUpload.data.filter((r) => r[xAxis] !== undefined && r[xAxis] !== "");
    const groups = {};
    rows.forEach((r) => {
      const val = yAxis ? Number(r[yAxis]) || 0 : 1;
      const key = r[xAxis];
      groups[key] = (groups[key] || 0) + val;
    });

    const labels = Object.keys(groups);
    const values = labels.map((l) => groups[l]);
    const colors = generateColors(labels.length);

    const titleLabel = createLabel("Chart Overview");
    titleLabel.position.set(0, 10.5, 0);
    scene.add(titleLabel);

    if (chartType === "3d-column") {
      const maxVal = Math.max(...values, 1);
      const scale = 8 / maxVal;

      labels.forEach((label, idx) => {
        const height = values[idx] * scale;
        const x = idx * 1.6 - (labels.length - 1) * 0.8;
        const y = height / 2 + 1.5;

        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, Math.max(0.1, height), 1.2),
          new THREE.MeshStandardMaterial({
            color: colors[idx],
            metalness: 0.3,
            roughness: 0.4,
            transparent: true,
            opacity: 0.95,
          })
        );
        mesh.position.set(x, y, 0);
        scene.add(mesh);

        const yLabel = createLabel(values[idx].toFixed(1));
        yLabel.position.set(x, y + height / 2 + 2.0, 0);
        scene.add(yLabel);

        const xLabel = createLabel(abbreviateText(label));
        xLabel.position.set(x, 0.6 + (idx % 2 === 0 ? 0.3 : -0.3), 0);
        scene.add(xLabel);
      });
    } else if (chartType === "3d-pie") {
      const total = values.reduce((a, b) => a + b, 0) || 1;
      const radius = Math.min(8, Math.max(3, labels.length));
      let startAngle = 0;
      const extrudeSettings = { depth: 1.2, bevelEnabled: false, steps: 1 };

      labels.forEach((label, idx) => {
        const angle = (values[idx] / total) * Math.PI * 2;
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.absarc(0, 0, radius, startAngle, startAngle + angle, false);
        shape.lineTo(0, 0);

        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.rotateX(Math.PI / 2);
        const midAngle = startAngle + angle / 2;
        const offsetX = Math.cos(midAngle) * 0.12;
        const offsetZ = Math.sin(midAngle) * 0.12;
        geom.translate(offsetX, 0, offsetZ);

               const mesh = new THREE.Mesh(
          geom,
          new THREE.MeshStandardMaterial({
            color: colors[idx],
            metalness: 0.3,
            roughness: 0.4,
            transparent: true,
            opacity: 0.95,
          })
        );
        mesh.position.y = 1.5;
        scene.add(mesh);

        const offsetY = idx % 2 === 0 ? 0.4 : -0.4;

        const valueLabel = createLabel(values[idx].toFixed(1));
        valueLabel.position.set(
          Math.cos(midAngle) * (radius + 1.2),
          2.4 + offsetY,
          Math.sin(midAngle) * (radius + 1.2)
        );
        scene.add(valueLabel);

        const categoryLabel = createLabel(abbreviateText(label));
        categoryLabel.position.set(
          Math.cos(midAngle) * (radius + 1.2),
          1.2 + offsetY,
          Math.sin(midAngle) * (radius + 1.2)
        );
        scene.add(categoryLabel);

        startAngle += angle;
      });

      camera.position.set(0, 16, 26);
      camera.lookAt(0, 2, 0);
    }

    // 🎞️ Animate with orbit controls
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 🧹 Cleanup on unmount
    return () => {
      renderer.forceContextLoss?.();
      renderer.domElement?.remove();
      scene.clear();
    };
  }, [selectedUpload, xAxis, yAxis, chartType]);

  return <div ref={containerRef} className="w-full max-w-5xl h-[500px]" />;
}
