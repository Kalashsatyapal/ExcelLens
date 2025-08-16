import React, { useEffect, useState, useRef } from "react";

export default function ChartSummary({ chartType, xAxis, yAxis, setChartSummary }) {
  const [summary, setSummary] = useState("");
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);

  useEffect(() => {
    if (!chartType || !xAxis) {
      setSummary("");
      setChartSummary("");
      setProgress(0);
      return;
    }

    setSummary("");
    setChartSummary("");
    setProgress(0);

    // Start smooth progress animation
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + Math.random() * 5;
        return prev;
      });
    }, 200);

    const prompt = `
      Summarize this chart in up to 100 words:
      Chart type: ${chartType}.
      X-axis: ${xAxis}. ${yAxis ? `Y-axis: ${yAxis}.` : ""}
    `;

    puter.ai
      .chat(prompt.trim(), { model: "gpt-4o-mini" })
      .then((res) => {
        clearInterval(progressInterval.current);
        setProgress(100);

        if (res?.message?.content) {
          const finalSummary = res.message.content;
          setTimeout(() => {
            setSummary(finalSummary);
            setChartSummary(finalSummary); // ✅ send to parent
          }, 500);
        } else {
          setSummary("No summary generated.");
          setChartSummary("No summary generated.");
        }
      })
      .catch(() => {
        clearInterval(progressInterval.current);
        setProgress(100);
        setSummary("Failed to generate summary.");
        setChartSummary("Failed to generate summary.");
      });

    return () => clearInterval(progressInterval.current);
  }, [chartType, xAxis, yAxis, setChartSummary]);

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded">
      <h3 className="font-semibold text-lg mb-2">Chart Summary</h3>

      {!summary && (
        <div>
          <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-3 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Generating summary... {Math.floor(progress)}%
          </p>
        </div>
      )}

      {summary && <p className="mt-2 text-gray-800">{summary}</p>}
    </div>
  );
}
