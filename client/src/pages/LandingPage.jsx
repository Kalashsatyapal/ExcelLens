import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/logo2.png"
              alt="ExcelLense Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-2xl font-bold text-indigo-600">ExcelLense</h1>
          </div>
          <nav className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20 bg-gradient-to-b from-indigo-50 to-white">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Analyze & Visualize Excel Data with Ease
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-6">
          ExcelLense is your one-stop solution for **Excel file uploads**, **data visualization**, **3D charting**, and **file management** — all powered by a modern MERN stack.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Powerful Features of ExcelLense
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Secure Authentication",
                desc: "JWT-based login system with User & Admin roles. Admin registration requires a secret passkey."
              },
              {
                title: "Excel Uploads",
                desc: "Drag-and-drop Excel file uploads with ExcelJS parsing and MongoDB storage."
              },
              {
                title: "File Management",
                desc: "View your upload history, preview files, and delete them when needed."
              },
              {
                title: "Data Visualization",
                desc: "Chart.js and Three.js powered 2D & 3D charts including bar, line, pie, scatter, and 3D column."
              },
              {
                title: "3D Pie Charts",
                desc: "WebGL-rendered 3D pie charts with the option to capture the canvas."
              },
              {
                title: "Export Charts",
                desc: "Download your charts as PNG or PDF for reports and presentations."
              }
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition"
              >
                <h4 className="text-xl font-semibold text-indigo-600 mb-3">
                  {f.title}
                </h4>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 mt-auto py-6">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ExcelLense. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
