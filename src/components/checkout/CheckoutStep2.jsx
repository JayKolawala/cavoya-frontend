import React from "react";
import { CreditCard, Smartphone } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";

const CheckoutStep2 = ({ onNext, onBack }) => {
  const { paymentMethod, setPaymentMethod } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-light mb-6 text-gray-900">Payment Method</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="text-gray-900 mr-3 accent-black"
            />
            <CreditCard className="h-5 w-5 mr-2 text-gray-700" />
            <span className="text-gray-800">Credit/Debit Card</span>
          </label>

          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={() => setPaymentMethod("upi")}
              className="text-gray-900 mr-3 accent-black"
            />
            <Smartphone className="h-5 w-5 mr-2 text-gray-700" />
            <span className="text-gray-800">UPI Payment</span>
          </label>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutStep2;