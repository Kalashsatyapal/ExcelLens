// pages/Settings.js
import React from "react";
import Header from "../components/Header";

export default function Settings() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-green-50 text-gray-800">
      <Header showAdminButtons={true} />

      <main className="container mx-auto px-6 py-10 space-y-8 flex-grow">
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-green-700 mb-4">Account Settings</h2>
          <p className="text-sm text-gray-600">
            Settings page content goes here. You can add password change, notification preferences, theme toggles, etc.
          </p>
        </section>
      </main>

      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
