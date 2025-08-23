// components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ active }) {
  const navigate = useNavigate();

  const links = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Admin Panel", path: "/admin" },
    { label: "Admin Requests", path: "/superadmin" },
    { label: "Uploads", path: "/admin/uploads" },
    { label: "Analyses History", path: "/admin/analyses" },
    { label: "User Management", path: "/admin/users/manage" },
  ];

  return (
    <aside className="w-64 h-screen bg-white text-gray-800 shadow-lg fixed top-0 left-0 z-20">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-purple-700">ExcelLense</h2>
      </div>
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`w-full text-left px-4 py-2 rounded-md font-medium ${
              active === link.label
                ? "bg-purple-700 text-white"
                : "hover:bg-purple-100 text-purple-700"
            }`}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
