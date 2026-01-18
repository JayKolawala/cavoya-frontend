import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { CheckCircle, Truck, Mail } from "lucide-react";

const CheckoutStep4 = ({ total }) => {
  const {
    confirmOrder,
    shippingInfo,
    orderNumber,
  } = useAppContext();
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    confirmOrder();
    navigate("/products");
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <CheckCircle className="h-16 w-16 text-gray-700 mx-auto mb-4" />
        <h2 className="text-2xl font-light mb-2 text-gray-900">Order Confirmed!</h2>
        <p className="text-gray-600 mb-4">Thank you for your purchase</p>
        <p className="text-sm text-gray-500">
          Order #: {orderNumber || `CAVOYA-${Date.now()}`}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
        <h3 className="text-lg font-medium mb-4 text-gray-900">What's Next?</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-700 mr-3" />
            <span className="text-gray-600">Order confirmation sent to {shippingInfo.email}</span>
          </div>
          <div className="flex items-center">
            <Truck className="h-5 w-5 text-gray-700 mr-3" />
            <span className="text-gray-600">Your order will be shipped within 2-3 business days</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Order Total</h3>
        <p className="text-2xl font-bold text-gray-900">₹{total}</p>
      </div>

      <button
        onClick={handleContinueShopping}
        className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        Continue Shopping
      </button>

      <p className="text-sm text-gray-500 mt-4">
        Need help? <a href="#" className="text-gray-700 hover:text-black hover:underline">Contact us</a>
      </p>
    </div>
  );
};

export default CheckoutStep4;