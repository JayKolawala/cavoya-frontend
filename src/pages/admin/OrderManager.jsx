// src/pages/admin/OrderManager.jsx
import React, { useState, useEffect } from "react";
import { ORDER_STATUSES } from "../../utils/constants";
import OrderFilters from "../../components/admin/orders/OrderFilters";
import OrderTable from "../../components/admin/orders/OrderTable";
import OrderStats from "../../components/admin/orders/OrderStats";
import useApi from "../../hooks/useApi";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { loading, error, get, patch } = useApi();

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const response = await get('/orders');
      if (response.success && response.data) {
        // Transform API response to match the component's expected format
        const transformedOrders = response.data.map((order) => ({
          _id: order._id, // ← CRITICAL: Keep MongoDB _id for API calls
          id: order.orderNumber, // Display ID
          customerName: order.customer.name,
          customerEmail: order.customer.email,
          customerPhone: order.customer.phone,
          orderDate: new Date(order.createdAt).toISOString().split('T')[0],
          status: order.status,
          totalAmount: order.pricing.total,
          paymentMethod: order.payment.method,
          paymentStatus: order.payment.status,
          shippingAddress: {
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            pincode: order.shippingAddress.postalCode,
            country: order.shippingAddress.country,
          },
          billingAddress: order.billingAddress || order.shippingAddress,
          items: order.items.map((item) => ({
            id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image,
          })),
          trackingNumber: order.trackingNumber || "",
          estimatedDelivery: order.estimatedDelivery || "",
          notes: order.statusHistory?.[order.statusHistory.length - 1]?.note || "",
        }));
        setOrders(transformedOrders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

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

  const handleOrderUpdate = async (
    orderId,
    newStatus,
    trackingNumber = "",
    notes = ""
  ) => {
    try {
      // Find the order to get its MongoDB _id
      const order = orders.find(o => o.id === orderId);

      if (!order || !order._id) {
        console.error('Order not found or missing _id:', orderId);
        alert('Failed to update order: Order not found');
        return;
      }

      // Debug logging
      console.log('Updating order:', {
        displayId: orderId,
        mongoId: order._id,
        endpoint: `/orders/${order._id}/status`,
        payload: {
          status: newStatus,
          note: notes || `Status changed to ${newStatus}`,
        }
      });

      // Call API to update order status using MongoDB _id
      const response = await patch(`/orders/${order._id}/status`, {
        status: newStatus,
        note: notes || `Status changed to ${newStatus}`,
      });

      console.log('Update response:', response);

      if (response.success) {
        // Update local state optimistically
        setOrders(
          orders.map((o) =>
            o.id === orderId
              ? {
                ...o,
                status: newStatus,
                trackingNumber: trackingNumber || o.trackingNumber,
                notes: notes || o.notes,
              }
              : o
          )
        );

        // Show success message
        console.log('Order updated successfully');

        // Optionally refetch to ensure sync with server
        // await fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Order Management</h1>
        <div className="text-sm text-gray-600 bg-gradient-to-r from-pink-50 to-rose-50 px-4 py-2 rounded-lg border border-pink-100">
          <span className="font-medium text-pink-900">Total Orders:</span>{" "}
          <span className="font-bold text-pink-600">{orders.length}</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Orders Content */}
      {!loading && !error && (
        <>
          {/* Order Statistics */}
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
        </>
      )}
    </div>
  );
};

export default OrderManager;