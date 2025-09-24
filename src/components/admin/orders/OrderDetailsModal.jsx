// src/components/admin/orders/OrderDetailsModal.jsx
import React from "react";
import { User, Package, MapPin, CreditCard } from "lucide-react";
import Modal from "../shared/Modal";
import StatusBadge from "../shared/StatusBadge";
import {
  formatDate,
  formatCurrency,
  formatAddress,
} from "../../../utils/formatters";

const OrderDetailsModal = ({ order, onClose }) => {
  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Order Details - ${order.id}`}
      size="lg"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Customer Information
          </h3>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {order.customerName}
            </p>
            <p>
              <strong>Email:</strong> {order.customerEmail}
            </p>
            <p>
              <strong>Phone:</strong> {order.customerPhone}
            </p>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Order Information
          </h3>
          <div className="space-y-2">
            <p>
              <strong>Order Date:</strong> {formatDate(order.orderDate)}
            </p>
            <p>
              <strong>Status:</strong>
              <StatusBadge
                status={order.status}
                type="order"
                className="ml-2"
              />
            </p>
            <p>
              <strong>Estimated Delivery:</strong>{" "}
              {formatDate(order.estimatedDelivery)}
            </p>
            {order.trackingNumber && (
              <p>
                <strong>Tracking Number:</strong> {order.trackingNumber}
              </p>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Shipping Address
          </h3>
          <div className="text-sm">
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
            <p>{order.shippingAddress.pincode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Information
          </h3>
          <div className="space-y-2">
            <p>
              <strong>Method:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Status:</strong>
              <StatusBadge
                status={order.paymentStatus}
                type="payment"
                className="ml-2"
              />
            </p>
            <p>
              <strong>Total Amount:</strong> {formatCurrency(order.totalAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Size/Color
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Quantity
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-t border-gray-200">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.size} / {item.color}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-gray-200 bg-gray-100">
                <td colSpan="4" className="px-4 py-3 text-right font-medium">
                  Subtotal:
                </td>
                <td className="px-4 py-3 font-bold">
                  {formatCurrency(calculateSubtotal(order.items))}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td colSpan="4" className="px-4 py-3 text-right font-medium">
                  Shipping:
                </td>
                <td className="px-4 py-3 font-medium">Free</td>
              </tr>
              <tr className="bg-gray-100 border-t border-gray-300">
                <td
                  colSpan="4"
                  className="px-4 py-3 text-right text-lg font-bold"
                >
                  Total:
                </td>
                <td className="px-4 py-3 text-lg font-bold">
                  {formatCurrency(order.totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Notes:</h4>
          <p className="text-yellow-700 text-sm">{order.notes}</p>
        </div>
      )}
    </Modal>
  );
};

export default OrderDetailsModal;
