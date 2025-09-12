import React, { useRef } from "react";
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

const generateColors = (num) =>
  Array.from({ length: num }, (_, i) => `hsl(${(i * 360) / num}, 70%, 50%)`);

const formatNumber = (num) => Math.round(num * 10) / 10;

export default function Chart2D({ selectedUpload, xAxis, yAxis, chartType }) {
  const chartRef = useRef();

  if (!selectedUpload || !xAxis) return <p>Select valid file and axes</p>;

  const rows = selectedUpload.data.filter(
    (r) =>
      r[xAxis] !== undefined &&
      r[xAxis] !== "" &&
      (chartType === "pie" ? true : yAxis ? r[yAxis] !== undefined && r[yAxis] !== "" : false)
  );

  const labels = rows.map((r) => r[xAxis]);

  const getGradient = (ctx, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
  };

  let dataObj = null;

  if (chartType === "pie") {
    if (!yAxis) {
      const counts = {};
      labels.forEach((l) => (counts[l] = (counts[l] || 0) + 1));
      dataObj = {
        labels: Object.keys(counts),
        datasets: [
          {
            data: Object.values(counts).map(formatNumber),
            backgroundColor: generateColors(Object.keys(counts).length),
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      };
    } else {
      const data = rows.map((r) => formatNumber(Number(r[yAxis]) || 0));
      dataObj = {
        labels,
        datasets: [
          {
            data,
            backgroundColor: generateColors(labels.length),
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      };
    }
  } else if (chartType === "scatter") {
    dataObj = {
      datasets: [
        {
          label: yAxis || "values",
          data: rows
            .map((r) => {
              const x = Number(r[xAxis]);
              const y = Number(r[yAxis]);
              if (Number.isFinite(x) && Number.isFinite(y)) return { x: formatNumber(x), y: formatNumber(y) };
              return null;
            })
            .filter(Boolean),
          backgroundColor: "rgba(75,192,192,0.8)",
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  } else {
    if (!yAxis) return <p>Select Y axis for this chart type</p>;
    const data = rows.map((r) => formatNumber(Number(r[yAxis]) || 0));
    dataObj = {
      labels,
      datasets: [
        {
          label: yAxis,
          data,
          backgroundColor: (context) =>
            chartType === "bar"
              ? getGradient(context.chart.ctx, "rgba(59,130,246,0.8)", "rgba(59,130,246,0.2)")
              : "rgba(59,130,246,0.6)",
          borderColor: "rgba(37,99,235,1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(37,99,235,1)",
          tension: 0.4,
          fill: chartType === "line" ? true : false,
        },
      ],
    };
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { family: "Inter, sans-serif", size: 13 },
          color: "#374151",
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleFont: { family: "Inter", size: 14 },
        bodyFont: { family: "Inter", size: 12 },
        cornerRadius: 6,
        padding: 10,
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.dataset.label || ""}: ${formatNumber(tooltipItem.raw)}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: xAxis, font: { size: 14 } },
        grid: { color: "rgba(203,213,225,0.3)" },
        ticks: { color: "#4b5563", font: { family: "Inter", size: 12 } },
      },
      y:
        chartType !== "pie"
          ? {
              title: { display: true, text: yAxis, font: { size: 14 } },
              grid: { color: "rgba(203,213,225,0.3)" },
              ticks: { color: "#4b5563", font: { family: "Inter", size: 12 } },
            }
          : undefined,
    },
  };

  const containerStyle = {
    height: 400,
    padding: "1rem",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.3)",
  };

  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
    scatter: Scatter,
  }[chartType];

  return ChartComponent ? (
    <div style={containerStyle}>
      <ChartComponent ref={chartRef} data={dataObj} options={options} />
    </div>
  ) : (
    <p>Unsupported 2D chart type</p>
  );
}
