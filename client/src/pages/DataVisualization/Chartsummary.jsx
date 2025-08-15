import React, { useEffect, useState } from "react";

export default function ChartSummary({ chartType, xAxis, yAxis }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chartType || !xAxis) {
      setSummary("");
      return;
    }

    setSummary("");
    setLoading(true);

    const prompt = `
      Summarize this chart in up to 100 words:
      Chart type: ${chartType}.
      X-axis: ${xAxis}. ${yAxis ? `Y-axis: ${yAxis}.` : ""}
    `;

    puter.ai
      .chat(prompt.trim(), { model: "gpt-4o-mini" })
      .then((res) => {
        if (res?.message?.content) {
          setSummary(res.message.content);
        } else {
          setSummary("No summary generated.");
        }
      })
      .catch(() => setSummary("Failed to generate summary."))
      .finally(() => setLoading(false));
  }, [chartType, xAxis, yAxis]);

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded">
      <h3 className="font-semibold text-lg mb-2">Chart Summary</h3>

      {loading ? (
        <div className="flex items-center space-x-1">
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
        </div>
      ) : (
        <p>{summary}</p>
      )}
    </div>
  );
}
