// src/admin/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../../utils/apiHelpers";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { confirmLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // browser will store the HTTP-only cookie from Set-Cookie header
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Token is in the HTTP-only cookie — JS never sees it.
        // Just update local auth state and navigate.
        confirmLogin();
        navigate("/admin/dashboard");
      } else {
        setErrorMsg(data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-50 py-16">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light">Cavoya Admin Panel</h2>
          <p className="text-gray-600 mt-2">Sign in to your admin account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {errorMsg && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-md">
                {errorMsg}
              </p>
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-pink-500 text-white rounded-md font-bold hover:bg-pink-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
