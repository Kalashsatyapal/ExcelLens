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
      icon: <FaLock className="text-teal-600 text-xl" />,
    },
    {
      title: "Excel Uploads",
      desc: "Drag-and-drop ExcelJS-powered uploads with MongoDB storage.",
      icon: <FaFileExcel className="text-green-600 text-xl" />,
    },
    {
      title: "File Management",
      desc: "Preview, track, and delete uploaded files with ease.",
      icon: <FaTrashAlt className="text-rose-500 text-xl" />,
    },
    {
      title: "Data Visualization",
      desc: "Chart.js & Three.js powered 2D/3D charts: bar, line, pie, scatter, and more.",
      icon: <FaChartBar className="text-indigo-600 text-xl" />,
    },
    {
      title: "Export Charts",
      desc: "Download charts as PNG or PDF for reports and presentations.",
      icon: <FaDownload className="text-cyan-600 text-xl" />,
    },
    {
      title: "Analysis History",
      desc: "Charts history is stored in the database for future access and comparison.",
      icon: <FaHistory className="text-slate-600 text-xl" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-zinc-50 via-white to-teal-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <img
              src="/src/assets/logo2.png"
              alt="ExcelLense Logo"
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-3xl font-bold text-teal-700 tracking-wide">
              ExcelLense
            </h1>
          </div>
          <nav className="space-x-4 flex items-center">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-700 transition"
            >
              <FaLock /> Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-700 transition"
            >
              <FaFileExcel /> Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-24 px-6 bg-gradient-to-b from-teal-100 via-white to-cyan-50">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500 mb-6 tracking-tight leading-tight">
          Empower Your Excel Workflow
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mb-8 leading-relaxed font-light tracking-wide">
          Upload, visualize, and manage Excel data with precision.{" "}
          <span className="font-semibold text-teal-600">Secure access</span>,{" "}
          <span className="font-semibold text-cyan-600">interactive charts</span>, and{" "}
          <span className="font-semibold text-indigo-600">intuitive file handling</span>—
          all in one seamless experience.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform duration-200"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-14 tracking-wide">
            Core Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map(({ title, desc, icon }, i) => (
              <div
                key={i}
                className="group p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ring-1 ring-transparent hover:ring-teal-300 hover:ring-offset-2"
              >
                <div className="flex items-center gap-3 mb-3">
                  {icon}
                  <h4 className="text-xl font-semibold text-gray-800 group-hover:text-teal-700 transition">
                    {title}
                  </h4>
                </div>
                <p className="text-gray-600 leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-100 to-teal-100 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
