import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const features = [
    {
      title: "Secure Authentication",
      desc: "JWT-based login with role-based access. Admins require a secret passkey.",
    },
    {
      title: "Excel Uploads",
      desc: "Drag-and-drop ExcelJS-powered uploads with MongoDB storage.",
    },
    {
      title: "File Management",
      desc: "Preview, track, and delete uploaded files with ease.",
    },
    {
      title: "Data Visualization",
      desc: "Chart.js & Three.js powered 2D/3D charts: bar, line, pie, scatter, and more.",
    },
    {
      title: "AI-Generated Summary",
      desc: "Automatically generate insights from uploaded Excel files using NLP-powered summarization.",
    },
    {
      title: "Export Charts",
      desc: "Download charts as PNG or PDF for reports and presentations.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-slate-50 to-emerald-50 text-slate-800">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
          {/* Logo */}
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
          <nav className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-700 transition"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-100 via-white to-sky-50">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
          Empower Your Excel Workflow
        </h2>
        <p className="text-xl text-slate-700 max-w-3xl mb-8">
          Upload, visualize, and manage Excel data with precision.{" "}
          <span className="font-semibold text-emerald-600">Secure access</span>,{" "}
          <span className="font-semibold text-sky-600">interactive charts</span>
          , and{" "}
          <span className="font-semibold text-indigo-600">
            intuitive file handling
          </span>
          —all in one seamless experience.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold rounded-md shadow-lg hover:scale-105 hover:shadow-xl transition transform duration-200"
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
            {features.map(({ title, desc }, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-xl border border-slate-200 shadow hover:shadow-lg transition duration-200"
              >
                <h4 className="text-xl font-semibold text-emerald-700 mb-2">
                  {title}
                </h4>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-100 to-emerald-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-slate-600 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and
          passion.
        </div>
      </footer>
    </div>
  );
}
