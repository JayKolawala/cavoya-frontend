// src/components/admin/customers/CustomerDetailsModal.jsx
import React, { useState } from "react";
import { User, ShoppingBag, MapPin } from "lucide-react";
import Modal from "../shared/Modal";
import StatusBadge from "../shared/StatusBadge";
import { formatDate, formatCurrency } from "../../../utils/formatters";
import { CUSTOMER_STATUSES } from "../../../utils/constants";

const CustomerDetailsModal = ({ customer, onClose, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState(customer.status);

  const handleStatusUpdate = () => {
    onStatusUpdate(customer.id, newStatus);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Customer Details - ${customer.name}`}
      size="xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Customer ID:</span>
              <span className="font-medium">{customer.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{customer.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{customer.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Join Date:</span>
              <span className="font-medium">
                {formatDate(customer.joinDate)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <StatusBadge status={customer.status} type="customer" />
            </div>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Order Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Orders:</span>
              <span className="font-medium text-xl">
                {customer.totalOrders}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Spent:</span>
              <span className="font-medium text-xl text-green-600">
                {formatCurrency(customer.totalSpent)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Order:</span>
              <span className="font-medium">
                {formatCurrency(customer.averageOrderValue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Order:</span>
              <span className="font-medium">
                {customer.lastOrderDate
                  ? formatDate(customer.lastOrderDate)
                  : "No orders"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Saved Addresses
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customer.addresses?.map((address) => (
            <div key={address.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 capitalize">
                  {address.type} Address
                </h4>
                {address.isDefault && (
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state}
                </p>
                <p>{address.pincode}</p>
                <p>{address.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      {customer.orders && customer.orders.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Items
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {customer.orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-t border-gray-200">
                    <td className="px-4 py-3 text-sm font-medium">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-4 py-3 text-sm">{order.items} items</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={order.status}
                        type="order"
                        size="xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Notes */}
      {customer.notes && (
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Notes:</h4>
          <p className="text-yellow-700 text-sm">{customer.notes}</p>
        </div>
      )}

      {/* Status Update Section */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">
              Update Customer Status
            </h4>
            <p className="text-sm text-gray-600">
              Change the customer's account status
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-pink-500 focus:border-pink-500"
            >
              {CUSTOMER_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={newStatus === customer.status}
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerDetailsModal;
