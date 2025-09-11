import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { CheckCircle, Truck, Mail } from "lucide-react";

const CheckoutStep4 = ({ total }) => {
  const { confirmOrder, shippingInfo, orderNumber = `CAVOYA-${Date.now()}` } = useAppContext();
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    confirmOrder();
    navigate("/products");
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-light mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-4">Thank you for your purchase</p>
        <p className="text-sm text-gray-500">Order #: {orderNumber}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
        <h3 className="text-lg font-medium mb-4">What's Next?</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-pink-500 mr-3" />
            <span>Order confirmation sent to {shippingInfo.email}</span>
          </div>
          <div className="flex items-center">
            <Truck className="h-5 w-5 text-pink-500 mr-3" />
            <span>Your order will be shipped within 2-3 business days</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Order Total</h3>
        <p className="text-2xl font-bold text-pink-500">₹{total}</p>
      </div>

      <button
        onClick={handleContinueShopping}
        className="px-8 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
      >
        Continue Shopping
      </button>

      <p className="text-sm text-gray-500 mt-4">
        Need help? <a href="#" className="text-pink-500 hover:underline">Contact us</a>
      </p>
    </div>
  );
};

export default CheckoutStep4;