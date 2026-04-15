import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import useCheckoutStore from "../store/useCheckoutStore";
import {
  processRazorpayPayment,
  calculateOrderPricing,
  createRazorpayOrder,
} from "../utils/paymentService";
import { Lock, AlertCircle } from "lucide-react";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice } = useCartStore();
  const {
    shippingInfo,
    paymentMethod,
    createOrder,
    confirmOrder,
  } = useCheckoutStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("initializing");
  const hasInitiated = React.useRef(false);
  const pendingOrderData = React.useRef(null);

  useEffect(() => {
    if (hasInitiated.current) return;

    if (cartItems.length === 0) {
      navigate("/cart");
    } else if (!shippingInfo.address1) {
      navigate("/checkout");
    } else {
      hasInitiated.current = true;
      initiatePayment();
    }
  }, []);

  const initiatePayment = async () => {
    setError(null);
    setIsProcessing(true);
    setStatus("processing");

    try {
      const pricing = calculateOrderPricing(getTotalPrice());
      const amountInPaise = Math.round(pricing.total * 100);

      // Step 1: Create Razorpay order via backend API
      const razorpayOrderData = await createRazorpayOrder({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      const orderId =
        razorpayOrderData.id ||
        razorpayOrderData.order?.id ||
        razorpayOrderData.data?.id;

      if (!orderId) {
        throw new Error("Failed to retrieve Razorpay order ID from backend response");
      }

      // Step 2: Create order in database with razorpayOrderId BEFORE payment
      const orderData = await createOrder({
        razorpayOrderId: orderId,
      });
      pendingOrderData.current = orderData;

      // Step 3: Open Razorpay checkout
      await processRazorpayPayment({
        orderId: orderId,
        amount: amountInPaise,
        currency: "INR",
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        onSuccess: (paymentResponse) => {
          // Payment successful - NO API CALL NEEDED HERE
          // Order will be confirmed automatically via webhook
          setStatus("success");
          confirmOrder(orderData.orderNumber);

          setTimeout(() => {
            navigate("/order-success");
          }, 1500);
        },
        onFailure: (err) => {
          setStatus("error");
          setIsProcessing(false);
          setError(err.message || "Payment failed. Please try again.");
        },
      });
    } catch (err) {
      setStatus("error");
      setIsProcessing(false);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {status === "processing" || status === "initializing" ? (
          <div className="py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-700 mx-auto mb-6"></div>
            <h2 className="text-2xl font-light mb-2 text-gray-900">
              Processing Payment
            </h2>
            <p className="text-gray-600">Please do not close this window...</p>
            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <Lock className="h-4 w-4 mr-1" />
              Secure Payment via Razorpay
            </div>
          </div>
        ) : status === "success" ? (
          <div className="py-8">
            <div className="rounded-full h-16 w-16 bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <svg
                className="h-8 w-8 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-light mb-2 text-gray-900">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Redirecting to order confirmation...
            </p>
          </div>
        ) : (
          <div className="py-4">
            <div className="rounded-full h-16 w-16 bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-gray-700" />
            </div>
            <h2 className="text-2xl font-light mb-2 text-gray-900">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleCancel}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Return to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
