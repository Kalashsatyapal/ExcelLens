import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

export default function Header({ showAdminButtons = false }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white/30 backdrop-blur-md shadow-md px-6 py-5 flex justify-between items-center border-b border-cyan-100">
      <div className="flex items-center gap-4">
        <img
          src="/logo2.png"
          alt="Logo"
          className="h-10 w-auto rounded-md shadow-sm"
        />
        <h1 className="text-2xl font-bold tracking-tight text-cyan-700">
          ExcelLense
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 font-semibold rounded-md hover:from-cyan-200 hover:to-blue-200 transition"
        >
          Dashboard
        </button>

        {showAdminButtons && ["admin", "superadmin"].includes(user.role) && (
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-white/40 backdrop-blur-md border border-cyan-300 text-cyan-700 font-semibold rounded-md hover:bg-white/60 transition shadow-sm"
          >
            Admin Panel
          </button>
        )}

        {showAdminButtons && user.role === "superadmin" && (
          <button
            onClick={() => navigate("/superadmin")}
            className="px-4 py-2 bg-white/40 backdrop-blur-md border border-blue-300 text-blue-700 font-semibold rounded-md hover:bg-white/60 transition shadow-sm"
          >
            Super Admin Panel
          </button>
        )}

        {/* Profile Dropdown */}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="flex items-center gap-2 px-3 py-2 bg-white/40 backdrop-blur-md hover:bg-white/60 rounded-md text-sm font-medium text-slate-700 transition shadow-sm">
            <div className="h-8 w-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
              {user.username?.[0]?.toUpperCase()}
            </div>
            <img
              src={
                user.profileImage
                  ? `${process.env.REACT_APP_API_URL}${user.profileImage}`
                  : "/default-avatar.png"
              }
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border bg-gray-100"
            />
            <ChevronDownIcon className="h-4 w-4 text-slate-500" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-20">
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
  );
}
