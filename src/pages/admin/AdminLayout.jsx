// src/admin/components/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Package,
  Users,
  FileText,
  Settings,
  LogOut,
  Home,
  LayoutDashboard,
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: FileText },
    // { name: "Customers", href: "/admin/customers", icon: Users },
    // { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  const isActive = (href) => location.pathname === href;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Gradient Background */}
        <div className="h-full bg-gradient-to-br from-pink-600 via-pink-500 to-rose-600 shadow-2xl">
          {/* Header */}
          <div className="relative flex items-center justify-between h-20 px-6 border-b border-white/20 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Cavoya
                </h1>
                <p className="text-xs text-pink-100">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                    active
                      ? "bg-white text-pink-600 shadow-lg shadow-pink-900/30"
                      : "text-pink-50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-600 rounded-r-full" />
                  )}

                  <IconComponent
                    className={`h-5 w-5 mr-3.5 transition-all duration-300 ${
                      active
                        ? "text-pink-600"
                        : "text-pink-100 group-hover:text-white group-hover:scale-110"
                    }`}
                  />
                  <span className="text-sm tracking-wide">{item.name}</span>

                  {/* Hover effect */}
                  {!active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 backdrop-blur-sm">
            <button
              onClick={handleLogout}
              className="group w-full flex items-center px-4 py-3.5 text-pink-50 hover:bg-white/10 hover:text-white rounded-xl font-medium transition-all duration-300"
            >
              <LogOut className="h-5 w-5 mr-3.5 text-pink-100 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
              <span className="text-sm tracking-wide">Logout</span>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-pink-600 hover:bg-pink-50 p-2 rounded-lg transition-all duration-200 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
              A
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-800">
                Welcome back,
              </span>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
