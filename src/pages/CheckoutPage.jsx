import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";

const CheckoutPage = () => {
  const { getTotalPrice, navigate, showCustomAlert } = useAppContext();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showCustomAlert("Your order has been placed successfully!", () =>
      navigate("home")
    );
  };

  const total = (parseFloat(getTotalPrice()) * 1.18).toFixed(2);

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-light mb-8">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-medium mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name*"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name*"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address*"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 md:col-span-2"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number*"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 md:col-span-2"
                  required
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-medium mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="address1"
                  placeholder="Address Line 1*"
                  value={formData.address1}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
                <input
                  type="text"
                  name="address2"
                  placeholder="Address Line 2 (Optional)"
                  value={formData.address2}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City*"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State*"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="PIN Code*"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-medium mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="card"
                    name="payment"
                    value="card"
                    defaultChecked
                    className="text-pink-500"
                  />
                  <label
                    htmlFor="card"
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Credit/Debit Card</span>
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="upi"
                    name="payment"
                    value="upi"
                    className="text-pink-500"
                  />
                  <label htmlFor="upi" className="cursor-pointer">
                    UPI Payment
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    className="text-pink-500"
                  />
                  <label htmlFor="cod" className="cursor-pointer">
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-medium mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>
                    ₹{(parseFloat(getTotalPrice()) * 0.18).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors"
              >
                Place Order - ₹{total}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CheckoutPage;
