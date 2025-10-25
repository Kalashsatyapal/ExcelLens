import React, { useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaLock, FaFileExcel } from "react-icons/fa";
// ...existing code...
export default function AuthForm({ type }) {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
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
      const { username, email, password, role } = formData;

      if (isRegister) {
        if (role === "admin") {
          await API.post("/auth/admin-requests", {
            username,
            email,
            password,
          });
          alert(
            "Admin registration request submitted. Await superadmin approval."
          );
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
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900 text-slate-100 font-sans">
      {/* Header (styled like LandingPage) */}
      <header className="bg-slate-800/60 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
          <div
            className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo2.png"
              alt="ExcelLense Logo"
              className="w-12 h-12 object-contain transition-transform hover:scale-105"
              loading="lazy"
            />
            <h1 className="text-2xl font-extrabold text-cyan-400 tracking-wide">
              ExcelLense
            </h1>
          </div>
          <nav className="space-x-4 flex items-center">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-cyan-500 text-cyan-300 rounded-md hover:bg-slate-600 transition"
            >
              <FaLock /> Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-indigo-500 text-indigo-300 rounded-md hover:bg-slate-600 transition"
            >
              <FaFileExcel /> Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Main - Hero + Auth Card */}
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero */}
          <section className="hidden lg:flex flex-col items-start text-left px-6 py-12 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-700 shadow-lg">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-slate-300 mb-4 tracking-tight">
              Empower Your Excel Workflow
            </h2>
            <p className="text-lg text-slate-300 max-w-lg mb-6 leading-relaxed font-light tracking-wide">
              Upload, visualize, and manage Excel data with precision.{" "}
              <span className="font-semibold text-cyan-400">Secure access</span>,{" "}
              <span className="font-semibold text-indigo-400">interactive charts</span>, and{" "}
              <span className="font-semibold text-slate-400">intuitive file handling</span>—all in one seamless experience.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4 w-full">
              <div className="p-4 bg-slate-800/40 rounded-lg border border-slate-700">
                <h4 className="text-sm font-semibold text-cyan-300">Secure Authentication</h4>
                <p className="text-xs text-slate-300 mt-1">JWT login with role-based access.</p>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-lg border border-slate-700">
                <h4 className="text-sm font-semibold text-indigo-300">Excel Uploads</h4>
                <p className="text-xs text-slate-300 mt-1">Drag-and-drop uploads with preview.</p>
              </div>
            </div>
          </section>

          {/* Auth Card (UI updated to match LandingPage look) */}
          <section className="mx-auto w-full max-w-md px-6 py-8 bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-700 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-cyan-300">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>

            {error && (
              <p className="mb-4 text-center bg-red-100 text-red-700 font-medium py-2 px-4 rounded-md shadow-sm text-sm">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="peer block w-full border border-slate-700 bg-white/10 px-4 pt-6 pb-2 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                  />
                  <label
                    htmlFor="username"
                    className="absolute text-sm text-slate-400 duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-4"
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
                  className="peer block w-full border border-slate-700 bg-white/10 px-4 pt-6 pb-2 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-slate-400 duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-4"
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
                  className="peer block w-full border border-slate-700 bg-white/10 px-4 pt-6 pb-2 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                />
                <label
                  htmlFor="password"
                  className="absolute text-sm text-slate-400 duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Password
                </label>
              </div>

              {isRegister && (
                <div className="relative z-0 w-full group">
                  <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="peer block w-full border border-slate-700 bg-white/10 px-4 pt-6 pb-2 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <label
                    htmlFor="role"
                    className="absolute text-sm text-slate-400 duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Role
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? "Please wait..." : isRegister ? "Sign Up" : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-300">
              {isRegister ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-cyan-300 hover:underline font-medium"
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
                    className="text-cyan-300 hover:underline font-medium"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer (matches landing) */}
      <footer className="bg-slate-800 py-6 border-t border-slate-700">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
// ...existing code...