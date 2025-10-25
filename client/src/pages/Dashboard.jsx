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
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900 text-slate-100 font-sans">
      {/* Header (styled like LandingPage) */}
      <header className="bg-slate-800/60 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo2.png"
              alt="Logo"
              className="h-12 w-12 object-contain transition-transform hover:scale-105"
            />
            <h1 className="text-2xl font-extrabold tracking-tight text-cyan-400">
              ExcelLense
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {["admin", "superadmin"].includes(user.role) && (
              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 bg-slate-700/40 border border-cyan-600 text-cyan-200 font-semibold rounded-md hover:bg-slate-700 transition"
              >
                Admin Panel
              </button>
            )}
            {user.role === "superadmin" && (
              <button
                onClick={() => navigate("/superadmin")}
                className="px-4 py-2 bg-slate-700/40 border border-indigo-600 text-indigo-200 font-semibold rounded-md hover:bg-slate-700 transition"
              >
                Super Admin Panel
              </button>
            )}

            {/* Profile Dropdown */}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex items-center gap-2 px-3 py-2 bg-slate-700/40 backdrop-blur-md hover:bg-slate-700/60 rounded-md text-sm font-medium text-slate-100 transition shadow-sm">
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
                <span className="font-semibold text-slate-100">{user.username}</span>
                <ChevronDownIcon className="h-4 w-4 text-slate-300" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-slate-800/90 backdrop-blur-md rounded-md shadow-lg ring-1 ring-black/20 focus:outline-none border border-slate-700">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate("/profile")}
                        className={`${
                          active ? "bg-slate-700/40" : ""
                        } flex w-full items-center rounded-md px-4 py-2 text-sm text-slate-100`}
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
                          active ? "bg-red-600/20 text-red-200" : "text-red-300"
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
        </div>
      </header>

      {/* Main Content (cards styled like LandingPage) */}
      <main className="flex-1 container mx-auto px-6 py-10 space-y-10">
        <section className="bg-slate-800/40 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-slate-700 transition hover:shadow-xl">
          <UploadSection />
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link
            to="/upload-history"
            className="group block bg-slate-800/40 text-slate-100 font-semibold text-center py-6 rounded-xl shadow hover:shadow-xl hover:scale-[1.03] transition-all duration-200 border border-slate-700"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition text-cyan-300">
              📁
            </div>
            <span className="text-lg tracking-wide">Upload History</span>
          </Link>
          <Link
            to="/analysis-history"
            className="group block bg-slate-800/40 text-slate-100 font-semibold text-center py-6 rounded-xl shadow hover:shadow-xl hover:scale-[1.03] transition-all duration-200 border border-slate-700"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition text-indigo-300">
              📊
            </div>
            <span className="text-lg tracking-wide">Analysis History</span>
          </Link>
          <Link
            to="/visualize"
            className="group block bg-slate-800/30 text-slate-100 font-semibold text-center py-6 rounded-xl shadow hover:shadow-xl hover:scale-[1.03] transition-all duration-200 border border-slate-700"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition text-slate-300">
              📈
            </div>
            <span className="text-lg tracking-wide">Data Visualization</span>
          </Link>
        </section>
      </main>

      {/* Footer (matches LandingPage) */}
      <footer className="bg-slate-800 py-6 border-t border-slate-700 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
