// src/admin/pages/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Package, Users, FileText, Settings } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Products",
      value: "24",
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "Total Orders",
      value: "12",
      icon: FileText,
      color: "text-green-500",
    },
    {
      title: "Total Customers",
      value: "48",
      icon: Users,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-20`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/products"
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package className="h-8 w-8 text-pink-500 mb-2" />
            <span className="text-sm font-medium">Manage Products</span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-8 w-8 text-pink-500 mb-2" />
            <span className="text-sm font-medium">View Orders</span>
          </Link>
          <Link
            to="/admin/customers"
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-8 w-8 text-pink-500 mb-2" />
            <span className="text-sm font-medium">Customer Management</span>
          </Link>
          <Link
            to="/admin/settings"
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-8 w-8 text-pink-500 mb-2" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
