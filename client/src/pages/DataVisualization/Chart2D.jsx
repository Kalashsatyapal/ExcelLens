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
  let dataObj = null;

  const formatNumber = (num) => Math.round(num * 10) / 10;

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
          },
        ],
      };
    } else {
      const data = rows.map((r) => formatNumber(Number(r[yAxis]) || 0));
      dataObj = { labels, datasets: [{ data, backgroundColor: generateColors(labels.length) }] };
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
          backgroundColor: "rgba(59,130,246,0.7)",
          borderColor: "rgba(37,99,235,1)",
          borderWidth: 1,
          fill: chartType === "line" ? false : true,
        },
      ],
    };
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.dataset.label || ""}: ${formatNumber(tooltipItem.raw)}`,
        },
      },
    },
    scales: {
      x: { title: { display: true, text: xAxis } },
      y: chartType !== "pie" ? { title: { display: true, text: yAxis } } : undefined,
    },
  };

  switch (chartType) {
    case "bar":
      return (
        <div style={{ height: 400 }}>
          <Bar ref={chartRef} data={dataObj} options={options} />
        </div>
      );
    case "line":
      return (
        <div style={{ height: 400 }}>
          <Line ref={chartRef} data={dataObj} options={options} />
        </div>
      );
    case "pie":
      return (
        <div style={{ height: 400 }}>
          <Pie ref={chartRef} data={dataObj} options={options} />
        </div>
      );
    case "scatter":
      return (
        <div style={{ height: 400 }}>
          <Scatter ref={chartRef} data={dataObj} options={options} />
        </div>
      );
    default:
      return <p>Unsupported 2D chart type</p>;
  }
}
