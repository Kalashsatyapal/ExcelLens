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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-green-50 text-gray-800">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <h1
            className="text-2xl font-bold text-green-700 tracking-tight cursor-pointer"
            onClick={() => navigate("/")}
          >
            ExcelLense
          </h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Back to Home
          </button>
        </div>
      </nav>

      {/* Form Container */}
      <div className="container mx-auto max-w-md mt-16 px-6 py-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        {error && (
          <p className="mb-4 text-center bg-red-100 text-red-700 font-medium py-2 px-4 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.role === "admin" && (
                <div>
                  <label htmlFor="adminPassKey" className="block text-sm font-medium text-gray-700">
                    Admin PassKey
                  </label>
                  <input
                    id="adminPassKey"
                    name="adminPassKey"
                    type="password"
                    required
                    value={formData.adminPassKey}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-md shadow hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isRegister ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-green-600 hover:underline"
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
                className="text-green-600 hover:underline"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} ExcelLense. Built with precision and passion.
        </div>
      </footer>
    </div>
  );
}
