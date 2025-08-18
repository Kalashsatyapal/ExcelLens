import React from "react";

export default function OverviewCard({ title, value, color }) {
  return (
    <div
      className={`p-6 rounded-xl shadow-md text-white font-semibold text-center ${color}`}
    >
      <h3 className="text-lg mb-2">{title}</h3>
      <p className="text-3xl">{value}</p>
    </div>
  );
}
