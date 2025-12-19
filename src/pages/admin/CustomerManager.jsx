// src/pages/admin/CustomerManager.jsx
import React, { useState } from "react";
import CustomerFilters from "../../components/admin/customers/CustomerFilters";
import CustomerStats from "../../components/admin/customers/CustomerStats";
import CustomerTable from "../../components/admin/customers/CustomerTable";

// Import your existing customer data (or replace with API call)
const SAMPLE_CUSTOMERS = [
  {
    id: "CUST-001",
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    phone: "+91 98765 43210",
    joinDate: "2024-08-15",
    status: "active",
    totalOrders: 5,
    totalSpent: 12450,
    averageOrderValue: 2490,
    lastOrderDate: "2025-09-20",
    addresses: [
      {
        id: 1,
        type: "home",
        isDefault: true,
        street: "123 MG Road, Apartment 4B",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
      },
    ],
    orders: [
      {
        id: "ORD-2025-001",
        date: "2025-09-20",
        amount: 2499,
        status: "pending",
        items: 2,
      },
    ],
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      promotionalEmails: true,
      favoriteCategories: ["Ethnic Wear", "Western Wear"],
      preferredSize: "M",
    },
    notes: "VIP customer - prefers express delivery",
  },
  // Add more sample customers here or replace with your existing data
];

const CustomerManager = () => {
  const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter customers based on search and status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCustomerUpdate = (updatedCustomer) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };

  const handleStatusUpdate = (customerId, newStatus) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === customerId
          ? { ...customer, status: newStatus }
          : customer
      )
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Customer Management
        </h1>
        <div className="text-sm text-gray-600 bg-gradient-to-r from-pink-50 to-rose-50 px-4 py-2 rounded-lg border border-pink-100">
          <span className="font-medium text-pink-900">Total Customers:</span>{" "}
          <span className="font-bold text-pink-600">{customers.length}</span>
        </div>
      </div>

      {/* Statistics */}
      <CustomerStats customers={customers} />

      {/* Filters */}
      <CustomerFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Customer Table */}
      <CustomerTable
        customers={filteredCustomers}
        onCustomerUpdate={handleCustomerUpdate}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default CustomerManager;
