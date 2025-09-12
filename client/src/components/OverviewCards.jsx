import React from "react";

export default function OverviewCard({ title, value, accent = "cyan" }) {
  const accentMap = {
    cyan: "text-cyan-600 ring-cyan-300",
    blue: "text-blue-600 ring-blue-300",
    slate: "text-slate-600 ring-slate-300",
    violet: "text-violet-600 ring-violet-300",
  };

  const accentClasses = accentMap[accent] || accentMap.cyan;

  return (
    <div
      className={`p-6 rounded-xl bg-white/60 backdrop-blur-md shadow-lg border border-white/30 text-center ring-2 ring-offset-2 ${accentClasses}`}
    >
      <h3 className="text-lg font-medium mb-2 text-slate-700">{title}</h3>
      <p className={`text-3xl font-bold ${accentClasses.split(" ")[0]}`}>{value}</p>
    </div>
  );
}
