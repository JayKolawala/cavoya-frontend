import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import { Truck, Shield, RefreshCw } from "lucide-react";

const CheckoutStep3 = ({ onNext, onBack, total }) => {
  const { cartItems, shippingInfo, paymentMethod, getTotalPrice } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-light mb-6">Order Review</h2>
      
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Order Items ({cartItems.length})</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center">
              <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded" />
              <div className="ml-4">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">Color: {item.color} | Size: {item.size}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
            <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        
        <div className="space-y-2 mt-4 pt-4 border-t">
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
            <span>₹{(parseFloat(getTotalPrice()) * 0.18).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
        <p className="text-gray-600">
          {shippingInfo.firstName} {shippingInfo.lastName}<br />
          {shippingInfo.address1}<br />
          {shippingInfo.address2 && `${shippingInfo.address2}<br />`}
          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
          {shippingInfo.country}<br />
          Phone: {shippingInfo.phone}<br />
          Email: {shippingInfo.email}
        </p>
      </div>

      {/* Payment Method */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Payment Method</h3>
        <p className="text-gray-600 capitalize">{paymentMethod}</p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600 mb-6">
        <div className="flex flex-col items-center">
          <Truck className="h-5 w-5 mb-1" />
          <span>Free Shipping</span>
        </div>
        <div className="flex flex-col items-center">
          <RefreshCw className="h-5 w-5 mb-1" />
          <span>Easy Returns</span>
        </div>
        <div className="flex flex-col items-center">
          <Shield className="h-5 w-5 mb-1" />
          <span>Secure Payment</span>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-8 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutStep3;