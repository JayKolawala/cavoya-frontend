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
      <div className="bg-white rounded-lg shadow">
        <div className="text-center py-8 text-gray-500">
          No customers found matching your criteria.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <span className="text-pink-600 font-medium text-sm">
                          {getInitials(customer.name)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">{customer.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.email}</div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(customer.joinDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {customer.totalOrders}
                  </div>
                  <div className="text-sm text-gray-500">
                    Last:{" "}
                    {customer.lastOrderDate
                      ? formatDate(customer.lastOrderDate)
                      : "Never"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Avg: {formatCurrency(customer.averageOrderValue)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={customer.status} type="customer" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewCustomer(customer)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit Customer"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
