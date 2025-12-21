import React, { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { ShoppingCart, Minus, Plus, X, Sparkles, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, updateCartQuantity, removeFromCart, getTotalPrice } =
    useAppContext();

  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

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
            Discover our beautiful collection and add some elegant items to your cart!
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
              YOUR SELECTIONS
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-3 text-gray-800">
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-lg">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}`}
                  className="group relative flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:mb-0 last:pb-0 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-tangerine-50/0 via-blush-50/50 to-tangerine-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>

                  <div className="flex items-center w-full sm:w-auto">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-32 rounded-xl object-cover shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                    </div>

                    <div className="ml-6 flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-tangerine-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        Color: <span className="font-medium text-gray-700">{item.color}</span> | Size: <span className="font-medium text-gray-700">{item.size}</span>
                      </p>
                      <p className="text-xl font-bold bg-gradient-to-r from-tangerine-600 to-blush-600 bg-clip-text text-transparent">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-4">
                    <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-200">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4 text-gray-700" />
                      </button>
                      <span className="font-bold text-lg px-4 min-w-[3rem] text-center text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all duration-200 hover:scale-110"
                      title="Remove item"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 overflow-hidden">
                {/* Decorative Gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-tangerine-500/10 to-blush-500/10 rounded-full blur-2xl"></div>

                <h2 className="relative text-2xl font-semibold mb-6 text-gray-800">
                  Order Summary
                </h2>

                <div className="relative space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-light">Subtotal:</span>
                    <span className="font-semibold">₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-light">Shipping:</span>
                    <span className="font-semibold text-matcha-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Free
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-light">Tax (18%):</span>
                    <span className="font-semibold">₹{(parseFloat(getTotalPrice()) * 0.18).toFixed(2)}</span>
                  </div>

                  <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-light text-gray-800">Total:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-tangerine-600 to-blush-600 bg-clip-text text-transparent">
                        ₹{(parseFloat(getTotalPrice()) * 1.18).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-4 bg-gradient-to-r from-tangerine-500 to-blush-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blush-500/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 mb-3"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="w-full py-4 border-2 border-blush-500 text-blush-600 font-semibold rounded-xl hover:bg-blush-50 transition-all duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CartPage;
