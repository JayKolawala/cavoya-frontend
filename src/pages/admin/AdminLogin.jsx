// src/admin/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple authentication (replace with proper auth in production)
    if (
      credentials.email === "admin@cavoya.com" &&
      credentials.password === "admin123"
    ) {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin/dashboard");
    } else {
      alert("Invalid credentials");
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
              className="w-full py-3 bg-pink-500 text-white rounded-md font-bold hover:bg-pink-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
