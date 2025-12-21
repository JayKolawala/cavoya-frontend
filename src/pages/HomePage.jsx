// pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Truck, RefreshCw, Shield, Star, Sparkles } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = () => {
  const { products, loading } = useAppContext();
  const [_selectedProduct, setSelectedProduct] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  const handleShopNowClick = () => {
    navigate("/products");
  };

  const handleViewAllClick = () => {
    navigate("/products");
  };

  return (
    <div className="animate-fade-in overflow-hidden">
      {/* Hero Section with Enhanced Design */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#4a1942]">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-tangerine-500/20 via-blush-500/30 to-sea-500/20 animate-pulse"></div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-tangerine-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blush-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-butter-500/5 rounded-full blur-3xl"></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero Content */}
        <div className={`relative z-10 text-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Sparkles className="w-4 h-4 text-butter-300" />
            <span className="text-butter-100 text-sm font-light tracking-wider">New Collection 2024</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-wide mb-6 text-white">
            The Cavoya Collection
          </h1>

          <p className="text-xl md:text-2xl font-light mb-12 text-gray-200 max-w-2xl mx-auto">
            Elegance in every stitch. Discover timeless fashion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleShopNowClick}
              className="group px-10 py-4 bg-gradient-to-r from-tangerine-500 to-blush-500 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-tangerine-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                Explore Collections
                <Star className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              </span>
            </button>


          </div>
        </div>

      </div>

      {/* Features Section with Glassmorphism */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4 text-gray-800">
              Why Choose Cavoya
            </h2>
            <p className="text-gray-600 text-lg">Experience excellence with every purchase</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-tangerine-400 to-tangerine-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
              <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-tangerine-400 to-tangerine-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">Free Shipping</h3>
                <p className="text-gray-600 leading-relaxed">
                  Complimentary shipping on all orders over ₹999 across India
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sea-400 to-sea-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
              <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-sea-400 to-sea-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <RefreshCw className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">Easy Returns</h3>
                <p className="text-gray-600 leading-relaxed">
                  Hassle-free 30-day return policy for complete peace of mind
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-matcha-400 to-matcha-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
              <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-matcha-400 to-matcha-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">Secure Payment</h3>
                <p className="text-gray-600 leading-relaxed">
                  Bank-grade encryption keeps your payment information safe
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="relative py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-blush-100 text-blush-600 rounded-full text-sm font-semibold tracking-wider">
                TRENDING NOW
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light mb-4 text-gray-800">
              Featured Styles
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Handpicked selections from our latest collection
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={product}
                    onProductClick={handleProductClick}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <button
              onClick={handleViewAllClick}
              className="group px-10 py-4 bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-blush-500/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                View All Products
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
