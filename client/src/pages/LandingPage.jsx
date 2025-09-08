import React from "react";
import { Link } from "react-router-dom";
import { FaLock, FaFileExcel, FaChartBar, FaDownload, FaHistory, FaTrashAlt } from "react-icons/fa";

export default function LandingPage() {
  const features = [
    {
      title: "Secure Authentication",
      desc: "JWT-based login with role-based access. Admins require a secret passkey.",
      icon: <FaLock className="text-emerald-600 text-xl" />,
    },
    {
      title: "Excel Uploads",
      desc: "Drag-and-drop ExcelJS-powered uploads with MongoDB storage.",
      icon: <FaFileExcel className="text-green-600 text-xl" />,
    },
    {
      title: "File Management",
      desc: "Preview, track, and delete uploaded files with ease.",
      icon: <FaTrashAlt className="text-red-500 text-xl" />,
    },
    {
      title: "Data Visualization",
      desc: "Chart.js & Three.js powered 2D/3D charts: bar, line, pie, scatter, and more.",
      icon: <FaChartBar className="text-indigo-600 text-xl" />,
    },
    {
      title: "Export Charts",
      desc: "Download charts as PNG or PDF for reports and presentations.",
      icon: <FaDownload className="text-sky-600 text-xl" />,
    },
    {
      title: "Analysis History",
      desc: "Charts history is stored in the database for future access and comparison.",
      icon: <FaHistory className="text-slate-600 text-xl" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-slate-50 to-emerald-50 text-slate-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <img
              src="/src/assets/logo2.png"
              alt="ExcelLense Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-2xl font-bold text-emerald-700 tracking-tight">
              ExcelLense
            </h1>
          </div>
          <nav className="space-x-4 flex items-center">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-400 text-white rounded-md hover:bg-emerald-700 transition"
            >
              <FaLock /> Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 px-4 py-2 bg-sky-400 text-white rounded-md hover:bg-sky-700 transition"
            >
              <FaFileExcel /> Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-100 via-white to-sky-50">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 mb-6 tracking-tight leading-tight">
          Empower Your Excel Workflow
        </h2>
        <p className="text-xl text-slate-700 max-w-3xl mb-8">
          Upload, visualize, and manage Excel data with precision.{" "}
          <span className="font-semibold text-emerald-600">Secure access</span>,{" "}
          <span className="font-semibold text-sky-600">interactive charts</span>, and{" "}
          <span className="font-semibold text-indigo-600">intuitive file handling</span>—
          all in one seamless experience.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-sky-400 text-white font-semibold rounded-md shadow-lg hover:scale-105 hover:shadow-xl transition transform duration-200"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-14">
            Core Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map(({ title, desc, icon }, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-xl border border-slate-200 shadow hover:shadow-xl hover:scale-[1.02] transition duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  {icon}
                  <h4 className="text-xl font-semibold text-slate-800">{title}</h4>
                </div>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-100 to-emerald-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-slate-600 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
