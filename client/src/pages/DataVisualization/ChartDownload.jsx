import React from "react";
import { jsPDF } from "jspdf";

export default function ChartDownload({ selectedUpload, xAxis, yAxis, chartType }) {
  const handleDownload = (type) => {
    let canvas = null;

    // Chart.js
    if (["bar", "line", "pie", "scatter"].includes(chartType)) {
      canvas = document.querySelector(".chartjs-render-monitor");
    } else if (["3d-column", "3d-pie"].includes(chartType)) {
      canvas = document.querySelector("canvas");
    }

    if (!canvas) {
      alert("No chart available for download");
      return;
    }

    if (type === "png") {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `chart_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else if (type === "pdf") {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`chart_${Date.now()}.pdf`);
    }
  };

  return (
    <div className="mt-4 space-x-4 text-center">
      <button
        onClick={() => handleDownload("png")}
        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Download PNG
      </button>
      <button
        onClick={() => handleDownload("pdf")}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Download PDF
      </button>
    </div>
  );
}
