// src/pages/admin/OrderManager.jsx
import React, { useState } from "react";
import { ORDER_STATUSES } from "../../utils/constants";
import OrderFilters from "../../components/admin/orders/OrderFilters";
import OrderTable from "../../components/admin/orders/OrderTable";
import OrderStats from "../../components/admin/orders/OrderStats";
import { useOrders, useUpdateOrderStatus } from "../../hooks/useOrders";
import AlertModal from "../../components/admin/shared/AlertModal";

const OrderManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Alert modal state
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "error" });
  const showAlert = (title, message, type = "error") =>
    setAlertModal({ isOpen: true, title, message, type });

  // ── React Query: fetch orders (cached per page/search/status) ────────────
  const queryParams = {
    page: currentPage,
    limit,
    ...(searchTerm ? { search: searchTerm } : {}),
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
  };
  const { data: ordersResponse, isLoading: loading, error: ordersError } = useOrders(queryParams);

  const rawOrders = ordersResponse?.data ?? [];
  const totalPages = ordersResponse?.totalPages ?? 1;
  const totalOrders = ordersResponse?.total ?? rawOrders.length;
  const error = ordersError?.message ?? null;

  // Transform API response to match component's expected shape
  const orders = rawOrders.map((order) => ({
    _id: order._id,
    id: order.orderNumber,
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    customerPhone: order.customer.phone,
    orderDate: order.createdAt,
    status: order.status,
    totalAmount: order.pricing.total,
    paymentMethod: order.payment.method,
    paymentStatus: order.payment.status,
    razorpayPaymentId: order.payment.razorpayPaymentId || order.payment.transactionId || "",
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

  // ── React Query mutation: update order status (auto-invalidates cache) ────
  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus();

  // Handle Search and Filter changes (reset to page 1)
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleOrderUpdate = async (
    orderId,
    newStatus,
    trackingNumber = "",
    notes = "",
  ) => {
    try {
      // Find the order to get its MongoDB _id
      const order = orders.find((o) => o.id === orderId);

      if (!order || !order._id) {
        console.error("Order not found or missing _id:", orderId);
        showAlert("Order Not Found", "Failed to update order: the order could not be found.");
        return;
      }

      // useUpdateOrderStatus mutation auto-invalidates the ['orders'] cache
      await updateOrderStatus({
        id: order._id,
        status: newStatus,
        trackingNumber: trackingNumber || undefined,
        note: notes || `Status changed to ${newStatus}`,
        notes: notes || undefined,
      });
    } catch (err) {
      console.error("Failed to update order status:", err);
      showAlert("Update Failed", "Failed to update order status. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal((p) => ({ ...p, isOpen: false }))}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Order Management
        </h1>
        <div className="text-sm text-gray-600 bg-gradient-to-r from-pink-50 to-rose-50 px-4 py-2 rounded-lg border border-pink-100">
          <span className="font-medium text-pink-900">Total Orders:</span>{" "}
          <span className="font-bold text-pink-600">{totalOrders}</span>
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
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
          />

          {/* Orders Table */}
          <OrderTable
            orders={orders}
            onOrderUpdate={handleOrderUpdate}
            currentPage={currentPage}
            totalPages={totalPages}
            totalOrders={totalOrders}
            limit={limit}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default OrderManager;
