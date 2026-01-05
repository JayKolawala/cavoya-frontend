import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import CheckoutStep3 from "../components/checkout/CheckoutStep3";
import CheckoutStep4 from "../components/checkout/CheckoutStep4";
import CheckoutStep1 from "../components/checkout/CheckoutStep1";
import ScrollToTop from "../components/ScrollToTop";
import { ShoppingCart, Sparkles, ShoppingBag } from "lucide-react";

const CheckoutPage = () => {
  const { cartItems, getTotalPrice } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#4a1942]">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-tangerine-500/20 via-blush-500/30 to-sea-500/20 animate-pulse"></div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blush-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-tangerine-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Empty Cart Content */}
        <div className={`relative z-10 text-center px-4 max-w-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8 inline-flex items-center justify-center w-32 h-32 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <ShoppingCart className="h-16 w-16 text-butter-300" />
          </div>

          <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
            Your Cart is Empty
          </h2>

          <p className="text-xl text-gray-200 mb-10 font-light">
            Add some items to proceed to checkout
          </p>

          <button
            onClick={() => navigate("/products")}
            className="group px-10 py-4 bg-gradient-to-r from-tangerine-500 to-blush-500 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-tangerine-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="flex items-center gap-2">
              Explore Collections
              <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  const total = (parseFloat(getTotalPrice()) * 1.18).toFixed(2);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Floating Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-tangerine-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-blush-500/5 rounded-full blur-3xl"></div>

      <section className={`relative container mx-auto px-4 pt-28 pb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blush-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blush-600" />
            <span className="text-blush-600 text-sm font-semibold tracking-wider">
              CHECKOUT PROCESS
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-3 text-gray-800">
            Complete Your Order
          </h1>
          <p className="text-gray-600 text-lg">
            Just a few steps away from your purchase
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= step
                    ? "bg-gradient-to-r from-tangerine-500 to-blush-500 border-transparent text-white shadow-lg"
                    : "border-gray-300 text-gray-400 bg-white"
                    }`}
                >
                  <span className="font-semibold">{step}</span>
                </div>
                <span className={`text-sm mt-2 font-medium transition-colors ${currentStep >= step ? 'text-gray-800' : 'text-gray-500'}`}>
                  {step === 1 && "Shipping"}
                  {step === 2 && "Review"}
                  {step === 3 && "Confirm"}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="relative mb-12">
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-tangerine-500 to-blush-500 rounded-full transform -translate-y-1/2 transition-all duration-500 shadow-lg"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>

          {/* Step Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            <ScrollToTop key={currentStep}>
              {currentStep === 1 && (
                <CheckoutStep1 onNext={() => setCurrentStep(2)} />
              )}
              {currentStep === 2 && (
                <CheckoutStep3
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                  total={total}
                />
              )}
              {currentStep === 3 && <CheckoutStep4 total={total} />}
            </ScrollToTop>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutPage;
