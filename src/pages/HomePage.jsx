// pages/HomePage.jsx
import React, { useState } from "react";
import { Truck, RefreshCw, Shield, Star } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { products } = useAppContext();
  const [_selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`); // Add the product ID to the URL
  };

  const handleShopNowClick = () => {
    navigate("/products"); // Use absolute path
  };

  const handleViewAllClick = () => {
    navigate("/products"); // Use absolute path
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="hero-section text-white flex items-center justify-center h-[60vh] md:h-[80vh] text-center bg-cover bg-center relative bg-[#E8D2C5]">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 animate-pulse">
          <h1 className="text-4xl md:text-6xl font-extralight tracking-wide mb-4">
            The Cavoya Collection
          </h1>
          <p className="text-lg md:text-xl font-light mb-8">
            Elegance in every stitch.
          </p>
          <button
            onClick={handleShopNowClick}
            className="px-8 py-3 bg-white text-gray-800 font-medium rounded-full hover:bg-gray-100 transition-transform transform hover:scale-105"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <Truck className="h-12 w-12 mx-auto mb-4 text-pink-500" />
            <p className="text-xl font-medium mb-2">Free Shipping</p>
            <p className="text-gray-600">Free shipping on orders over ₹999</p>
          </div>
          <div className="p-6">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 text-pink-500" />
            <h3 className="text-xl font-medium mb-2">Easy Returns</h3>
            <p className="text-gray-600">30-day return policy for all items</p>
          </div>
          <div className="p-6">
            <Shield className="h-12 w-12 mx-auto mb-4 text-pink-500" />
            <h3 className="text-xl font-medium mb-2">Secure Payment</h3>
            <p className="text-gray-600">
              Your payment information is safe with us
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl md:text-4xl text-center mb-12">
          Featured Styles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            onClick={handleViewAllClick}
            className="px-8 py-3 border-2 border-pink-500 text-pink-500 rounded-full hover:bg-pink-500 hover:text-white transition-colors"
          >
            View All Products
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

