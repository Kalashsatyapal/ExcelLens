import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UploadSection from "../components/UploadSection";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-emerald-50 text-gray-800 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src="logo2.png"
            alt="Logo"
            className="h-10 w-auto rounded-md shadow-sm"
          />
          <h1 className="text-3xl font-extrabold tracking-tight text-emerald-700">
            ExcelLense
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {["admin", "superadmin"].includes(user.role) && (
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-md hover:bg-emerald-200 transition"
            >
              Admin Panel
            </button>
          )}
          {user.role === "superadmin" && (
            <button
              onClick={() => navigate("/superadmin")}
              className="px-4 py-2 bg-violet-100 text-violet-700 font-semibold rounded-md hover:bg-violet-200 transition"
            >
              Super Admin Panel
            </button>
          )}

          {/* Profile Dropdown */}
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition">
              <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                {user.username?.[0]?.toUpperCase()}
              </div>
              <span className="font-semibold">{user.username}</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-20">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700`}
                    >
                      My Profile
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${
                        active ? "bg-red-100 text-red-700" : "text-red-600"
                      } flex w-full items-center rounded-md px-4 py-2 text-sm font-semibold`}
                    >
                      Log Out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 space-y-10 flex-grow">
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200 transition hover:shadow-lg">
          <UploadSection />
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link
            to="/upload-history"
            className="group block bg-emerald-50 text-emerald-900 font-semibold text-center py-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition">📁</div>
            <span className="text-lg tracking-wide">Upload History</span>
          </Link>
          <Link
            to="/analysis-history"
            className="group block bg-sky-50 text-sky-900 font-semibold text-center py-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition">📊</div>
            <span className="text-lg tracking-wide">Analysis History</span>
          </Link>
          <Link
            to="/visualize"
            className="group block bg-gray-50 text-gray-800 font-semibold text-center py-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition">📈</div>
            <span className="text-lg tracking-wide">Data Visualization</span>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-6 mt-auto">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-emerald-600">ExcelLense</span>. Built
          with precision and passion.
        </div>
      </footer>
    </div>
  );
}
