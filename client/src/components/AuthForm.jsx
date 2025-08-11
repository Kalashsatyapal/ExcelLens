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
      if (isRegister) {
        const { username, email, password, role, adminPassKey } = formData;
        const payload = { username, email, password, role };
        if (role === "admin") payload.adminPassKey = adminPassKey;

        await API.post("/auth/register", payload);
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        const { email, password } = formData;
        const res = await API.post("/auth/login", { email, password });
        login(res.data.user, res.data.token);
        navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <>
      <nav className="bg-green-500 text-white px-6 py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1
            className="text-2xl font-bold tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            ExcelLense
          </h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-white text-green-600 rounded-md hover:bg-gray-100 transition"
          >
            Back to Home
          </button>
        </div>
      </nav>
      <div className="max-w-md mx-auto mt-16 px-6 py-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg transition-all">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        {error && (
          <p className="mb-4 text-center text-red-500 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-md bg-sky-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md bg-sky-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md bg-sky-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-md bg-sky-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.role === "admin" && (
                <div>
                  <label
                    htmlFor="adminPassKey"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Admin PassKey
                  </label>
                  <input
                    id="adminPassKey"
                    name="adminPassKey"
                    type="password"
                    required
                    value={formData.adminPassKey}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border rounded-md bg-sky-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isRegister ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-green-500 hover:underline dark:text-green-400"
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
                className="text-green-500 hover:underline dark:text-green-400"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
