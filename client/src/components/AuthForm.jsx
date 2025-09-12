import React, { useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ type }) {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    adminPassKey: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = type === "register";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { username, email, password, role, adminPassKey } = formData;

      if (isRegister) {
        if (role === "admin") {
          await API.post("/auth/admin-requests", {
            username,
            email,
            password,
            adminPassKey,
          });
          alert("Admin registration request submitted. Await superadmin approval.");
          navigate("/login");
        } else {
          await API.post("/auth/register", { username, email, password, role });
          alert("Registration successful! Please login.");
          navigate("/login");
        }
      } else {
        const res = await API.post("/auth/login", { email, password });
        login(res.data.user, res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-slate-800 font-sans">
      {/* Header */}
      <nav className="bg-white/30 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-cyan-100">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div
            className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition"
            onClick={() => navigate("/")}
          >
            <img
              src="/src/assets/logo2.png"
              alt="Admin Logo"
              className="h-10 w-10 object-contain drop-shadow-sm"
            />
            <h1 className="text-2xl font-extrabold text-cyan-700 tracking-tight">
              ExcelLense
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:scale-105 transition shadow-sm"
          >
            Back to Home
          </button>
        </div>
      </nav>

      {/* Form Container */}
      <div className="container mx-auto max-w-md mt-16 px-6 py-8 bg-white/50 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30">
        <h2 className="text-3xl font-bold text-center mb-6 text-cyan-700">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        {error && (
          <p className="mb-4 text-center bg-red-100 text-red-700 font-medium py-2 px-4 rounded-md shadow-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="username"
                id="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder=" "
                className="peer block w-full border border-gray-300 bg-white/70 px-4 pt-6 pb-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(6,182,212,0.3)] transition"
              />
              <label
                htmlFor="username"
                className="absolute text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Username
              </label>
            </div>
          )}

          <div className="relative z-0 w-full group">
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              className="peer block w-full border border-gray-300 bg-white/70 px-4 pt-6 pb-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(6,182,212,0.3)] transition"
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Email
            </label>
          </div>

          <div className="relative z-0 w-full group">
            <input
              type="password"
              name="password"
              id="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              className="peer block w-full border border-gray-300 bg-white/70 px-4 pt-6 pb-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(6,182,212,0.3)] transition"
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Password
            </label>
          </div>

          {isRegister && (
            <>
              <div className="relative z-0 w-full group">
                <select
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="peer block w-full border border-gray-300 bg-white/70 px-4 pt-6 pb-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(6,182,212,0.3)] transition"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <label
                  htmlFor="role"
                  className="absolute text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Role
                </label>
              </div>

              {formData.role === "admin" && (
                <div className="relative z-0 w-full group">
                  <input
                    type="password"
                    name="adminPassKey"
                    id="adminPassKey"
                    required
                    value={formData.adminPassKey}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer block w-full border border-gray-300 bg-white/70 px-4 pt-6 pb-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(6,182,212,0.3)] transition"
                  />
                  <label
                    htmlFor="adminPassKey"
                    className="absolute text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Admin PassKey
                  </label>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isRegister ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-cyan-600 hover:underline font-medium"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-cyan-600 hover:underline font-medium"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-100 to-cyan-100 py-6 mt-auto border-t border-gray-200">
        <div className="container mx-auto text-center text-slate-500 text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-cyan-700">ExcelLense</span>. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
