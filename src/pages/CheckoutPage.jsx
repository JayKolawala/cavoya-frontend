import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import CheckoutStep2 from "../components/checkout/CheckoutStep2";
import CheckoutStep3 from "../components/checkout/CheckoutStep3";
import CheckoutStep4 from "../components/checkout/CheckoutStep4";
import CheckoutStep1 from "../components/checkout/CheckoutStep1";
import ScrollToTop from "../components/ScrollToTop";

const CheckoutPage = () => {
  const { cartItems, getTotalPrice } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-24 w-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-light mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Add some items to proceed to checkout
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-8 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  const total = (parseFloat(getTotalPrice()) * 1.18).toFixed(2);

  return (
    <section className="container mx-auto px-4 pt-24">
      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step
                    ? "bg-pink-500 border-pink-500 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {step}
              </div>
              <span className="text-sm mt-2 text-gray-600">
                {step === 1 && "Shipping"}
                {step === 2 && "Payment"}
                {step === 3 && "Review"}
                {step === 4 && "Confirm"}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="relative mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-pink-500 transform -translate-y-1/2 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <ScrollToTop key={currentStep}>
            {currentStep === 1 && (
              <CheckoutStep1 onNext={() => setCurrentStep(2)} />
            )}
            {currentStep === 2 && (
              <CheckoutStep2
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <CheckoutStep3
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
                total={total}
              />
            )}
            {currentStep === 4 && <CheckoutStep4 total={total} />}
          </ScrollToTop>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
