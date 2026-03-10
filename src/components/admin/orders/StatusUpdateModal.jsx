// src/components/admin/orders/StatusUpdateModal.jsx
import React, { useState } from "react";
import Modal from "../shared/Modal";
import { ORDER_STATUSES } from "../../../utils/constants";
import { AlertTriangle } from "lucide-react";

const getStatusLabel = (value) =>
  ORDER_STATUSES.find((s) => s.value === value)?.label ?? value;

const StatusUpdateModal = ({ order, onSave, onClose }) => {
  const [newStatus, setNewStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || "",
  );
  const [notes, setNotes] = useState(order.notes || "");
  const [confirming, setConfirming] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirming(true);
  };

  const handleConfirm = () => {
    onSave(order.id, newStatus, trackingNumber, notes);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Update Order Status"
      size="sm"
    >
      {confirming ? (
        /* ── Confirmation view ── */
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertTriangle
              className="text-amber-500 mt-0.5 shrink-0"
              size={20}
            />
            <div>
              <p className="font-semibold text-amber-800 text-sm">
                Confirm Status Update
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Are you sure you want to change the status for order{" "}
                <span className="font-bold">{order.id}</span>?
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">
                  {getStatusLabel(order.status)}
                </span>
                <span className="text-gray-400">→</span>
                <span className="px-2 py-0.5 bg-pink-100 rounded text-pink-700 font-medium">
                  {getStatusLabel(newStatus)}
                </span>
              </div>
              {notes && (
                <p className="text-xs text-gray-500 mt-2">Note: {notes}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            >
              Yes, Update Status
            </button>
          </div>
        </div>
      ) : (
        /* ── Edit form ── */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID: {order.id}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracking Number
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or comments"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              Update Status
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default StatusUpdateModal;
