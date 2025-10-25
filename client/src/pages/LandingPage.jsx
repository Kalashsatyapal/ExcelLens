import React from "react";
import { Link } from "react-router-dom";
import {
  FaLock,
  FaFileExcel,
  FaChartBar,
  FaDownload,
  FaHistory,
  FaTrashAlt,
} from "react-icons/fa";

export default function LandingPage() {
  const features = [
    {
      title: "Secure Authentication",
      desc: "JWT-based login with role-based access. Admins require a secret passkey.",
      icon: <FaLock className="text-cyan-400 text-xl group-hover:scale-125 group-hover:drop-shadow-md transition-transform duration-300" />,
      badge: "Secure",
    },
    {
      title: "Excel Uploads",
      desc: "Drag-and-drop ExcelJS-powered uploads with MongoDB storage.",
      icon: <FaFileExcel className="text-indigo-400 text-xl group-hover:scale-125 group-hover:drop-shadow-md transition-transform duration-300" />,
      badge: "New",
    },
    {
      title: "File Management",
      desc: "Preview, track, and delete uploaded files with ease.",
      icon: <FaTrashAlt className="text-slate-300 text-xl group-hover:scale-125 group-hover:drop-shadow-md transition-transform duration-300" />,
    },
    {
      title: "Data Visualization",
      desc: "Chart.js & Three.js powered 2D/3D charts: bar, line, pie, scatter, and more.",
      icon: <FaChartBar className="text-indigo-400 text-xl group-hover:scale-125 group-hover:drop-shadow-md transition-transform duration-300" />,
    },
    {
      title: "Export Charts",
      desc: "Download charts as PNG or PDF for reports and presentations.",
      icon: <FaDownload className="text-cyan-400 text-xl group-hover:scale-125 group-hover:drop-shadow-md transition-transform duration-300" />,
    },
    {
      title: "Analysis History",
      desc: "Charts history is stored in the database for future access and comparison.",
      icon: <FaHistory className="text-slate-400 text-xl group-hover:scale-125 group-hover:drop-shadow-md transition-transform duration-300" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-800/60 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <img
              src="/logo2.png"
              alt="ExcelLense Logo"
              className="w-14 h-14 object-contain transition-transform hover:scale-105"
              loading="lazy"
            />
            <h1 className="text-3xl font-bold text-cyan-400 tracking-wide">
              ExcelLense
            </h1>
          </div>
          <nav className="space-x-4 flex items-center">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-cyan-500 text-cyan-300 rounded-md hover:bg-slate-600 transition"
            >
              <FaLock /> Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-indigo-500 text-indigo-300 rounded-md hover:bg-slate-600 transition"
            >
              <FaFileExcel /> Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-24 px-6 bg-gradient-to-b from-slate-800 via-slate-900 to-indigo-900">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-slate-300 mb-6 tracking-tight leading-tight">
          Empower Your Excel Workflow
        </h2>
        <p className="text-lg text-slate-300 max-w-3xl mb-8 leading-relaxed font-light tracking-wide">
          Upload, visualize, and manage Excel data with precision.{" "}
          <span className="font-semibold text-cyan-400">Secure access</span>,{" "}
          <span className="font-semibold text-indigo-400">interactive charts</span>, and{" "}
          <span className="font-semibold text-slate-400">intuitive file handling</span>—
          all in one seamless experience.
        </p>
        <div className="flex gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform duration-200"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-slate-100 mb-14 tracking-wide">
            Core Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map(({ title, desc, icon, badge }, i) => (
              <div
                key={i}
                className="group p-6 bg-slate-800/40 backdrop-blur-lg rounded-xl border border-slate-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ring-1 ring-transparent hover:ring-cyan-400 hover:ring-offset-2"
              >
                <div className="flex items-center gap-3 mb-3">
                  {icon}
                  <h4 className="text-xl font-semibold text-slate-100 group-hover:text-cyan-300 transition">
                    {title}
                  </h4>
                  {badge && (
                    <span className="ml-auto text-xs bg-cyan-500 text-white px-2 py-1 rounded-full">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 py-6 border-t border-slate-700">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}