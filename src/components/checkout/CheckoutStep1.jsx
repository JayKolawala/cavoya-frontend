import React from "react";
import { useAppContext } from "../../contexts/AppContext";

const CheckoutStep1 = ({ onNext }) => {
  const { shippingInfo, setShippingInfo } = useAppContext();

  const handleInputChange = (e) => {
    setShippingInfo({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-light mb-6 text-gray-900">Shipping Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name*"
            value={shippingInfo.firstName}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name*"
            value={shippingInfo.lastName}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address*"
          value={shippingInfo.email}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number*"
          value={shippingInfo.phone}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          required
        />

        <input
          type="text"
          name="address1"
          placeholder="Address Line 1*"
          value={shippingInfo.address1}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          required
        />

        <input
          type="text"
          name="address2"
          placeholder="Address Line 2 (Optional)"
          value={shippingInfo.address2}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City*"
            value={shippingInfo.city}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State*"
            value={shippingInfo.state}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
          <input
            type="text"
            name="zipCode"
            placeholder="PIN Code*"
            value={shippingInfo.zipCode}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutStep1;