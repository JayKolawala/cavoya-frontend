// src/admin/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { post, loading } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      // POST https://api.cavoya.in/api/admin/login
      const response = await post("/admin/login", {
        email: credentials.email,
        password: credentials.password,
      });

      // Handle token from response (supports { token }, { data: { token } })
      const token = response.token || response.data?.token;

      if (token) {
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminToken", token);
        navigate("/admin/dashboard");
      } else {
        setErrorMsg(
          response.message || "Invalid credentials. Please try again.",
        );
      }
    } catch (err) {
      setErrorMsg("Invalid email or password. Please try again.");
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
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
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
