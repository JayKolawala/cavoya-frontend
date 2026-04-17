import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCheckoutStore from "../store/useCheckoutStore";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { orderNumber, resetCheckout } = useCheckoutStore();
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    if (!orderNumber) {
      navigate("/");
    }
  }, [orderNumber, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="rounded-full h-20 w-20 bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-serif mb-2 text-gray-900">
          Order Confirmed!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {orderNumber && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-xl font-semibold text-gray-900">{orderNumber}</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
          <Package className="h-4 w-4" />
          <span>We'll send you a confirmation email shortly</span>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            View Orders
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => {
              resetCheckout();
              navigate("/");
            }}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;