import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { Truck, Shield, RefreshCw } from "lucide-react";
import {
  processRazorpayPayment,
  calculateOrderPricing,
} from "../../utils/paymentService";

const CheckoutStep3 = ({ onNext, onBack, total }) => {
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

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // For COD, create order directly
      if (paymentMethod === "cod") {
        console.log("Processing COD order...");
        const orderData = await createOrder(null);

        if (orderData && orderData.orderNumber) {
          confirmOrder(orderData.orderNumber);
          onNext();
        } else {
          throw new Error("Failed to create order");
        }
      }
      // For online payment (Card/UPI), process payment first
      else {
        console.log("Processing online payment...");
        const pricing = calculateOrderPricing(getTotalPrice());

        await processRazorpayPayment({
          amount: pricing.total,
          customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          customerEmail: shippingInfo.email,
          customerPhone: shippingInfo.phone,
          onSuccess: async (paymentInfo) => {
            try {
              console.log("Payment successful, creating order...");
              // Create order after successful payment
              const orderData = await createOrder(paymentInfo);

              if (orderData && orderData.orderNumber) {
                confirmOrder(orderData.orderNumber);
                setIsProcessing(false);
                onNext();
              } else {
                throw new Error("Failed to create order after payment");
              }
            } catch (err) {
              setIsProcessing(false);
              setError(
                `Payment successful but order creation failed: ${err.message}. Please contact support with your payment details.`
              );
              console.error("Order creation error:", err);
            }
          },
          onFailure: (err) => {
            setIsProcessing(false);
            setError(err.message || "Payment failed. Please try again.");
            console.error("Payment error:", err);
          },
        });
      }
    } catch (err) {
      setIsProcessing(false);
      setError(err.message || "An error occurred. Please try again.");
      console.error("Order processing error:", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-light mb-6">Order Review</h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">
          Order Items ({cartItems.length})
        </h3>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-b"
          >
            <div className="flex items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-20 object-cover rounded"
              />
              <div className="ml-4">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">
                  Color: {item.color} | Size: {item.size}
                </p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
            <span className="font-semibold">
              ₹{(item.price * item.quantity).toFixed(2)}
            </span>
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
          {shippingInfo.firstName} {shippingInfo.lastName}
          <br />
          {shippingInfo.address1}
          <br />
          {shippingInfo.address2 && `${shippingInfo.address2}\n`}
          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
          <br />
          {shippingInfo.country}
          <br />
          Phone: {shippingInfo.phone}
          <br />
          Email: {shippingInfo.email}
        </p>
      </div>

      {/* Payment Method */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Payment Method</h3>
        <p className="text-gray-600 capitalize">
          {paymentMethod === "card" && "Credit/Debit Card"}
          {paymentMethod === "upi" && "UPI Payment"}
          {paymentMethod === "cod" && "Cash on Delivery"}
        </p>
        {paymentMethod !== "cod" && (
          <p className="text-sm text-gray-500 mt-2">
            You will be redirected to Razorpay for secure payment
          </p>
        )}
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
          disabled={isProcessing}
          className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          type="submit"
          onClick={handleConfirmOrder}
          disabled={isProcessing}
          className="px-8 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {paymentMethod === "cod" ? "Processing..." : "Opening Payment..."}
            </>
          ) : (
            "Confirm Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutStep3;