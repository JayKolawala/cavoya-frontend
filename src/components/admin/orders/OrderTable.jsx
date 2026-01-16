// src/components/admin/orders/OrderTable.jsx
import React, { useState } from "react";
import { Eye, Edit } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";
import OrderDetailsModal from "./OrderDetailsModal";
import StatusUpdateModal from "./StatusUpdateModal";
import { formatDate, formatCurrency } from "../../../utils/formatters";

const OrderTable = ({ orders, onOrderUpdate }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  // Reset to page 1 when orders change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (order) => {
    setEditingOrder(order);
    setShowStatusModal(true);
  };

  const handleSaveStatus = (orderId, newStatus, trackingNumber, notes) => {
    onOrderUpdate(orderId, newStatus, trackingNumber, notes);
    setShowStatusModal(false);
    setEditingOrder(null);
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-pink-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">
            No orders found matching your criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Responsive Table Container */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Modern Gradient Header */}
            <thead className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Sr No.
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-transparent transition-all duration-200 group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {startIndex + index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-gray-900">
                        {order.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-pink-600">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} type="order" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-600 mb-1">
                      {order.paymentMethod}
                    </div>
                    <StatusBadge
                      status={order.paymentStatus}
                      type="payment"
                      size="xs"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="p-2 text-pink-600 hover:text-pink-700 hover:bg-pink-100 rounded-lg transition-all duration-200 group/btn"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order)}
                        className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-all duration-200 group/btn"
                        title="Update Status"
                      >
                        <Edit className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {orders.length > 0 && (
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-pink-50/30 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page Info */}
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{startIndex + 1}</span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(endIndex, orders.length)}
                </span>{" "}
                of <span className="font-semibold">{orders.length}</span> orders
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {/* Status Update Modal */}
      {showStatusModal && editingOrder && (
        <StatusUpdateModal
          order={editingOrder}
          onSave={handleSaveStatus}
          onClose={() => {
            setShowStatusModal(false);
            setEditingOrder(null);
          }}
        />
      )}
    </>
  );
};

export default OrderTable;
