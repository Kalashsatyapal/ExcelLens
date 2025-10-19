import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UploadSection from "../components/UploadSection";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon, UserIcon } from "@heroicons/react/20/solid";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-slate-800 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/30 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center border-b border-cyan-100">
        <div className="flex items-center gap-4">
          <img
            src="logo2.png"
            alt="Logo"
            className="h-10 w-auto rounded-md shadow-sm"
          />
          <h1 className="text-3xl font-extrabold tracking-tight text-cyan-700">
            ExcelLense
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {["admin", "superadmin"].includes(user.role) && (
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 bg-cyan-100 text-cyan-700 font-semibold rounded-md hover:bg-cyan-200 transition"
            >
              Admin Panel
            </button>
          )}
          {user.role === "superadmin" && (
            <button
              onClick={() => navigate("/superadmin")}
              className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200 transition"
            >
              Super Admin Panel
            </button>
          )}

          {/* Profile Dropdown */}
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center gap-2 px-3 py-2 bg-white/40 backdrop-blur-md hover:bg-white/60 rounded-md text-sm font-medium text-slate-700 transition shadow-sm">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border bg-gray-100 shadow"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border shadow">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
              )}
              <span className="font-semibold">{user.username}</span>
              <ChevronDownIcon className="h-4 w-4 text-slate-500" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } flex w-full items-center rounded-md px-4 py-2 text-sm text-slate-700`}
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
        <section className="bg-white/60 backdrop-blur-md rounded-xl shadow-md p-6 border border-white/30 transition hover:shadow-lg">
          <UploadSection />
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link
            to="/upload-history"
            className="group block bg-cyan-50 text-cyan-900 font-semibold text-center py-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition">
              📁
            </div>
            <span className="text-lg tracking-wide">Upload History</span>
          </Link>
          <Link
            to="/analysis-history"
            className="group block bg-blue-50 text-blue-900 font-semibold text-center py-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition">
              📊
            </div>
            <span className="text-lg tracking-wide">Analysis History</span>
          </Link>
          <Link
            to="/visualize"
            className="group block bg-white/70 backdrop-blur-md text-slate-800 font-semibold text-center py-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.03] transition-all duration-200 border border-white/30"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition">
              📈
            </div>
            <span className="text-lg tracking-wide">Data Visualization</span>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-100 to-cyan-100 py-6 mt-auto border-t border-gray-200">
        <div className="container mx-auto text-center text-slate-500 text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-cyan-700">ExcelLense</span>. Built
          with precision and passion.
        </div>
      </footer>
    </div>
  );
}
