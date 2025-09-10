// components/Header.js
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

export default function Header({ showAdminButtons = false }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm px-6 py-5 flex justify-between items-center border-b border-gray-200">
      <div className="flex items-center gap-4">
        <img
          src="/logo2.png"
          alt="Logo"
          className="h-10 w-auto rounded-md shadow-sm"
        />
        <h1 className="text-2xl font-bold tracking-tight text-green-700">
          ExcelLense
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-md hover:bg-indigo-200 transition"
        >
          Dashboard
        </button>
        {showAdminButtons && ["admin", "superadmin"].includes(user.role) && (
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 font-semibold rounded-md hover:from-green-200 hover:to-green-300 transition"
          >
            Admin Panel
          </button>
        )}
        {showAdminButtons && user.role === "superadmin" && (
          <button
            onClick={() => navigate("/superadmin")}
            className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 font-semibold rounded-md hover:from-purple-200 hover:to-purple-300 transition"
          >
            Super Admin Panel
          </button>
        )}
      </div>
    </header>
  );
}
