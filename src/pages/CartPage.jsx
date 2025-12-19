import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, updateCartQuantity, removeFromCart, getTotalPrice } =
    useAppContext();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <section className="container mx-auto px-4 pt-24 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="h-24 w-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-light mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Add some beautiful items to get started!
          </p>
          <button
            onClick={() => navigate("products")}
            className="px-8 py-3 bg-blush-500 text-white rounded-lg hover:bg-blush-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 pt-24">
      <h1 className="text-3xl font-light mb-8">
        Your Shopping Cart ({cartItems.length} items)
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.color}-${item.size}`}
                className="flex flex-col sm:flex-row items-center justify-between border-b pb-6 mb-6 last:border-b-0 last:mb-0"
              >
                <div className="flex items-center w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-32 rounded-lg object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-500">
                      Color: {item.color} | Size: {item.size}
                    </p>
                    <p className="text-lg font-semibold mt-1">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="p-1 rounded-full border hover:bg-gray-100 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold text-lg px-3">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="p-1 rounded-full border hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="text-matcha-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{(parseFloat(getTotalPrice()) * 0.18).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>
                    ₹{(parseFloat(getTotalPrice()) * 1.18).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 py-3 bg-blush-500 text-white font-bold rounded-lg hover:bg-blush-600 transition-colors"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full mt-3 py-3 border border-blush-500 text-blush-600 font-bold rounded-lg hover:bg-blush-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
