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
      <h2 className="text-2xl font-light mb-6">Shipping Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name*"
            value={shippingInfo.firstName}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name*"
            value={shippingInfo.lastName}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address*"
          value={shippingInfo.email}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number*"
          value={shippingInfo.phone}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
          required
        />

        <input
          type="text"
          name="address1"
          placeholder="Address Line 1*"
          value={shippingInfo.address1}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
          required
        />

        <input
          type="text"
          name="address2"
          placeholder="Address Line 2 (Optional)"
          value={shippingInfo.address2}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City*"
            value={shippingInfo.city}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State*"
            value={shippingInfo.state}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          <input
            type="text"
            name="zipCode"
            placeholder="PIN Code*"
            value={shippingInfo.zipCode}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutStep1;