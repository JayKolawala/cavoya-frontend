// src/components/admin/customers/EditCustomerModal.jsx
import React, { useState } from "react";
import Modal from "../shared/Modal";
import { CUSTOMER_STATUSES, CLOTHING_SIZES } from "../../../utils/constants";

const EditCustomerModal = ({ customer, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    ...customer,
    addresses: [...(customer.addresses || [])],
    preferences: { ...customer.preferences },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));
  };

  const addNewAddress = () => {
    const newAddress = {
      id: Date.now(),
      type: "home",
      isDefault: false,
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    };
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddress],
    }));
  };

  const removeAddress = (index) => {
    if (formData.addresses.length > 1) {
      const updatedAddresses = formData.addresses.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        addresses: updatedAddresses,
      }));
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Edit Customer - ${customer.name}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                {CUSTOMER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              rows="3"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Add notes about this customer..."
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Size
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                value={formData.preferences?.preferredSize || "M"}
                onChange={(e) =>
                  handlePreferenceChange("preferredSize", e.target.value)
                }
              >
                {CLOTHING_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                checked={formData.preferences?.emailNotifications || false}
                onChange={(e) =>
                  handlePreferenceChange("emailNotifications", e.target.checked)
                }
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Email Notifications
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                checked={formData.preferences?.smsNotifications || false}
                onChange={(e) =>
                  handlePreferenceChange("smsNotifications", e.target.checked)
                }
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                SMS Notifications
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                checked={formData.preferences?.promotionalEmails || false}
                onChange={(e) =>
                  handlePreferenceChange("promotionalEmails", e.target.checked)
                }
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Promotional Emails
              </span>
            </label>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Addresses</h3>
            <button
              type="button"
              onClick={addNewAddress}
              className="text-sm text-pink-600 hover:text-pink-700"
            >
              + Add Address
            </button>
          </div>
          <div className="space-y-4">
            {formData.addresses.map((address, index) => (
              <div
                key={address.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <select
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    value={address.type}
                    onChange={(e) =>
                      handleAddressChange(index, "type", e.target.value)
                    }
                  >
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        checked={address.isDefault}
                        onChange={(e) =>
                          handleAddressChange(
                            index,
                            "isDefault",
                            e.target.checked
                          )
                        }
                      />
                      <span className="ml-1">Default</span>
                    </label>
                    {formData.addresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAddress(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Street Address"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                      value={address.street}
                      onChange={(e) =>
                        handleAddressChange(index, "street", e.target.value)
                      }
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                    value={address.city}
                    onChange={(e) =>
                      handleAddressChange(index, "city", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                    value={address.state}
                    onChange={(e) =>
                      handleAddressChange(index, "state", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                    value={address.pincode}
                    onChange={(e) =>
                      handleAddressChange(index, "pincode", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                    value={address.country}
                    onChange={(e) =>
                      handleAddressChange(index, "country", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCustomerModal;
