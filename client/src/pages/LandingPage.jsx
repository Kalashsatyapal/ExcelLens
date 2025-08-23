import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-green-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo2.png"
              alt="ExcelLense Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-2xl font-bold text-green-700 tracking-tight">
              ExcelLense
            </h1>
          </div>
          <nav className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-24 px-6 bg-gradient-to-b from-green-100 via-white to-blue-50">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Empower Your Excel Workflow
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-8">
          Upload, visualize, and manage Excel data with precision. ExcelLense
          brings together <strong>secure access</strong>,{" "}
          <strong>interactive charts</strong>, and{" "}
          <strong>intuitive file handling</strong> in one seamless experience.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-md shadow hover:shadow-lg transition"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-14">
            Core Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
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
                title: "3D Pie Charts",
                desc: "WebGL-rendered pie charts with canvas capture support.",
              },
              {
                title: "Export Charts",
                desc: "Download charts as PNG or PDF for reports and presentations.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <h4 className="text-lg font-semibold text-green-700 mb-2">
                  {f.title}
                </h4>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
