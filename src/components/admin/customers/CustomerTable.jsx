// src/components/admin/customers/CustomerTable.jsx
import React, { useState } from "react";
import { Eye, Edit } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";
import CustomerDetailsModal from "./CustomerDetailsModal";
import EditCustomerModal from "./EditCustomerModal";
import {
  formatDate,
  formatCurrency,
  getInitials,
} from "../../../utils/formatters";

const CustomerTable = ({ customers, onCustomerUpdate, onStatusUpdate }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer({ ...customer });
    setShowEditModal(true);
  };

  const handleSaveCustomer = (updatedCustomer) => {
    onCustomerUpdate(updatedCustomer);
    setShowEditModal(false);
    setEditingCustomer(null);
  };

  const handleUpdateStatus = (customerId, newStatus) => {
    onStatusUpdate(customerId, newStatus);
    setShowDetailsModal(false);
    setSelectedCustomer(null);
  };

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No customers found matching your criteria.</p>
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
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-transparent transition-all duration-200 group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-11 w-11 flex-shrink-0">
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md ring-2 ring-pink-100">
                          <span className="text-white font-bold text-sm">
                            {getInitials(customer.name)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {customer.name}
                        </div>
                        <div className="text-xs text-gray-500">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-xs text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(customer.joinDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-pink-600">
                      {customer.totalOrders}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last:{" "}
                      {customer.lastOrderDate
                        ? formatDate(customer.lastOrderDate)
                        : "Never"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-pink-600">
                      {formatCurrency(customer.totalSpent)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Avg: {formatCurrency(customer.averageOrderValue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={customer.status} type="customer" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewCustomer(customer)}
                        className="p-2 text-pink-600 hover:text-pink-700 hover:bg-pink-100 rounded-lg transition-all duration-200 group/btn"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleEditCustomer(customer)}
                        className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-all duration-200 group/btn"
                        title="Edit Customer"
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

        {/* Table Footer with Count */}
        <div className="bg-gradient-to-r from-gray-50 to-pink-50/30 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Showing <span className="font-semibold text-pink-600">{customers.length}</span> customer{customers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedCustomer(null);
          }}
          onStatusUpdate={handleUpdateStatus}
        />
      )}

      {/* Edit Customer Modal */}
      {showEditModal && editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onClose={() => {
            setShowEditModal(false);
            setEditingCustomer(null);
          }}
        />
      )}
    </>
  );
};

export default CustomerTable;
