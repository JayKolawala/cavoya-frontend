import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import useCheckoutStore from "../store/useCheckoutStore";
import {
  processRazorpayPayment,
  calculateOrderPricing,
  createRazorpayOrder,
} from "../utils/paymentService";
import { API_BASE_URL } from "../utils/apiHelpers";
import { Lock, AlertCircle } from "lucide-react";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice } = useCartStore();
  const { shippingInfo, paymentMethod, createOrder, confirmOrder } =
    useCheckoutStore();

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

      // Prepare order data (will be sent to webhook via notes)
      const orderNotes = {
        customer: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
        },
        shippingAddress: {
          street: shippingInfo.address2
            ? `${shippingInfo.address1}, ${shippingInfo.address2}`
            : shippingInfo.address1,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postalCode: shippingInfo.zipCode,
          country: shippingInfo.country || "India",
        },
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          color: item.color || "Default",
          size: item.size || "Default",
          subtotal: item.price * item.quantity,
        })),
        pricing: {
          subtotal: parseFloat(pricing.subtotal.toFixed(2)),
          shippingCost: parseFloat(pricing.shippingCost.toFixed(2)),
          tax: parseFloat(pricing.tax.toFixed(2)),
          discount: 0,
          total: parseFloat(pricing.total.toFixed(2)),
        },
        paymentMethod: paymentMethod,
      };

      // Step 1: Create Razorpay order with order data in notes
      const razorpayOrderData = await createRazorpayOrder({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: orderNotes,
      });

      const orderId =
        razorpayOrderData.id ||
        razorpayOrderData.order?.id ||
        razorpayOrderData.data?.id;

      if (!orderId) {
        throw new Error(
          "Failed to retrieve Razorpay order ID from backend response",
        );
      }

      // Store order data for fallback (if webhook doesn't work)
      sessionStorage.setItem("pendingOrderData", JSON.stringify(orderNotes));

      // Step 2: Open Razorpay checkout (order will be created via webhook after payment)
      await processRazorpayPayment({
        orderId: orderId,
        amount: amountInPaise,
        currency: "INR",
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        onSuccess: async (paymentResponse) => {
          // Payment successful
          setStatus("success");

          const razorpayOrderId = paymentResponse.razorpay_order_id;
          const razorpayPaymentId = paymentResponse.razorpay_payment_id;

          // First, poll for existing order (max 5 seconds)
          let orderCreated = false;
          let orderConfirmData = null;

          for (let i = 0; i < 5; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
              const res = await fetch(
                `${API_BASE_URL}/orders/check/${razorpayOrderId}`,
              );
              const data = await res.json();
              if (data.success && data.data) {
                orderCreated = true;
                orderConfirmData = data.data;
                break;
              }
            } catch (e) { }
          }

          // If not found via polling, use fallback endpoint to create order
          if (!orderCreated) {
            try {
              // Get stored order data from sessionStorage
              const storedOrderData =
                sessionStorage.getItem("pendingOrderData");
              const orderPayload = storedOrderData
                ? JSON.parse(storedOrderData)
                : null;

              const response = await fetch(`${API_BASE_URL}/payment/confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpayOrderId,
                  razorpayPaymentId,
                  customer: orderPayload?.customer,
                  shippingAddress: orderPayload?.shippingAddress,
                  items: orderPayload?.items,
                  pricing: orderPayload?.pricing,
                  paymentMethod: orderPayload?.paymentMethod,
                }),
              });
              const confirmData = await response.json();
              if (confirmData.success && confirmData.data) {
                orderConfirmData = confirmData.data;
              }
            } catch (e) {
              console.error("Failed to confirm order:", e);
            }
          }

          // Clear cart and session, then navigate
          useCartStore.getState().clearCart();
          sessionStorage.removeItem("pendingOrderData");
          useCheckoutStore
            .getState()
            .confirmOrder(orderConfirmData?.orderNumber);

          navigate("/order-success");
        },
        onFailure: (err) => {
          // Payment failed - just show error, no order created
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Floating Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gray-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-gray-300/20 rounded-full blur-3xl pointer-events-none" />

      <section className="relative container mx-auto px-4 pt-28 pb-20 flex flex-col items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
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
      </section>
    </div>
  );
};

export default PaymentPage;
