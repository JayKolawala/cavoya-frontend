// src/pages/admin/OrderManager.jsx
import React, { useState } from "react";
import { ORDER_STATUSES } from "../../utils/constants";
import OrderFilters from "../../components/admin/orders/OrderFilters";
import OrderTable from "../../components/admin/orders/OrderTable";
import OrderStats from "../../components/admin/orders/OrderStats"; // Add this import

// Import your existing order data (or replace with API call)
const SAMPLE_ORDERS = [
  {
    id: "ORD-2025-001",
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@gmail.com",
    customerPhone: "+91 98765 43210",
    orderDate: "2025-09-20",
    status: "pending",
    totalAmount: 2499,
    paymentMethod: "UPI",
    paymentStatus: "paid",
    shippingAddress: {
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
    billingAddress: {
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
    items: [
      {
        id: 1,
        name: "Floral Summer Dress",
        price: 1299,
        quantity: 1,
        size: "M",
        color: "Pink",
        image:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300",
      },
      {
        id: 2,
        name: "Casual Cotton Kurti",
        price: 899,
        quantity: 1,
        size: "L",
        color: "Blue",
        image:
          "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=300",
      },
    ],
    trackingNumber: "",
    estimatedDelivery: "2025-09-25",
    notes: "",
  },
  // Add more sample orders here or replace with your existing data
];

const OrderManager = () => {
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOrderUpdate = (
    orderId,
    newStatus,
    trackingNumber = "",
    notes = ""
  ) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              trackingNumber: trackingNumber || order.trackingNumber,
              notes: notes || order.notes,
            }
          : order
      )
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <div className="text-sm text-gray-600">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Order Statistics */}
      {/* FIXED: Changed ORDER_STATUSES to OrderStats */}
      <OrderStats orders={orders} />

      {/* Filters */}
      <OrderFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Orders Table */}
      <OrderTable orders={filteredOrders} onOrderUpdate={handleOrderUpdate} />
    </div>
  );
};

export default OrderManager;
