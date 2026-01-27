import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import {
  processRazorpayPayment,
  calculateOrderPricing,
  createRazorpayOrder,
  verifyPayment,
} from "../utils/paymentService";
import { Shield, Lock, AlertCircle } from "lucide-react";
import RatingModal from "../components/RatingModal";

const PaymentPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    shippingInfo,
    paymentMethod,
    getTotalPrice,
    createOrder,
    confirmOrder,
  } = useAppContext();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("initializing"); // initializing, processing, verifying, success, error
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [orderDataForRating, setOrderDataForRating] = useState(null);
  const [orderNumberForRating, setOrderNumberForRating] = useState(null);
  const hasInitiated = React.useRef(false);

  // Redirect if no items or missing info
  useEffect(() => {
    if (hasInitiated.current) return;

    if (cartItems.length === 0) {
      navigate("/cart");
    } else if (!shippingInfo.address1) {
      navigate("/checkout");
    } else {
      // Auto-start payment process
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

      // Convert to paise (Razorpay expects smallest currency unit)
      const amountInPaise = Math.round(pricing.total * 100);

      // Step 1: Create Razorpay order via backend API
      const razorpayOrderData = await createRazorpayOrder({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      // Handle different response structures (direct ID, nested order.id, or nested data.id)
      const orderId =
        razorpayOrderData.id ||
        razorpayOrderData.order?.id ||
        razorpayOrderData.data?.id;

      if (!orderId) {
        console.error("Invalid order data:", razorpayOrderData);
        throw new Error(
          "Failed to retrieve Razorpay order ID from backend response"
        );
      }

      // Step 2: Open Razorpay checkout with order ID from backend
      await processRazorpayPayment({
        orderId: orderId,
        amount: amountInPaise,
        currency: "INR",
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        onSuccess: async (paymentResponse) => {
          try {
            setStatus("verifying");

            // Step 3: Verify payment with backend
            const verificationResult = await verifyPayment({
              razorpay_order_id: paymentResponse.orderId,
              razorpay_payment_id: paymentResponse.paymentId,
              razorpay_signature: paymentResponse.signature,
            });

            if (!verificationResult || !verificationResult.success) {
              throw new Error("Payment verification failed");
            }

            // Step 4: Create order in database

            const orderData = await createOrder({
              paymentId: paymentResponse.paymentId,
              orderId: paymentResponse.orderId,
            });

            if (orderData && orderData.orderNumber) {
              setStatus("success");
              confirmOrder(orderData.orderNumber);

              // Store order data for rating modal and show it
              setOrderDataForRating({
                items: cartItems,
                orderNumber: orderData.orderNumber,
              });
              setOrderNumberForRating(orderData.orderNumber);
              setShowRatingModal(true);
            } else {
              throw new Error("Failed to create order after payment");
            }
          } catch (err) {
            setStatus("error");
            setIsProcessing(false);
            setError(
              `Payment successful but verification/order creation failed: ${err.message
              }. Response: ${JSON.stringify(paymentResponse)}`
            );
            console.error("Post-payment error:", err);
          }
        },
        onFailure: (err) => {
          setStatus("error");
          setIsProcessing(false);
          setError(err.message || "Payment failed. Please try again.");
          console.error("Payment error:", err);
        },
      });
    } catch (err) {
      setStatus("error");
      setIsProcessing(false);
      setError(err.message || "An error occurred. Please try again.");
      console.error("Payment initialization error:", err);
    }
  };

  const handleRetry = () => {
    initiatePayment();
  };

  const handleCancel = () => {
    navigate("/checkout");
  };

  // User skipped/closed the rating modal without submitting
  const handleRatingModalCancel = () => {
    setShowRatingModal(false);
    navigate("/checkout?step=4");
  };

  // User finished rating successfully – go to products listing
  const handleRatingModalSuccess = () => {
    setShowRatingModal(false);
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {status === "processing" || status === "initializing" ? (
          <div className="py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-700 mx-auto mb-6"></div>
            <h2 className="text-2xl font-light mb-2 text-gray-900">Processing Payment</h2>
            <p className="text-gray-600">Please do not close this window...</p>
            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <Lock className="h-4 w-4 mr-1" />
              Secure Payment via Razorpay
            </div>
          </div>
        ) : status === "verifying" ? (
          <div className="py-8">
            <div className="animate-pulse rounded-full h-16 w-16 bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-gray-700" />
            </div>
            <h2 className="text-2xl font-light mb-2 text-gray-900">Verifying Payment</h2>
            <p className="text-gray-600">Confirming your transaction...</p>
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
            <h2 className="text-2xl font-light mb-2 text-gray-900">Payment Successful!</h2>
            <p className="text-gray-600">
              Redirecting to order confirmation...
            </p>
          </div>
        ) : (
          <div className="py-4">
            <div className="rounded-full h-16 w-16 bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-gray-700" />
            </div>
            <h2 className="text-2xl font-light mb-2 text-gray-900">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleRetry}
                className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
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

      {/* Rating Modal - Shows after successful payment */}
      {showRatingModal && orderDataForRating && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={handleRatingModalCancel}
          orderData={orderDataForRating}
          orderNumber={orderNumberForRating}
          customerEmail={shippingInfo.email}
          onSuccess={handleRatingModalSuccess}
        />
      )}
    </div>
  );
};

export default PaymentPage;
