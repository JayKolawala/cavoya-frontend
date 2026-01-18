// pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Truck, RefreshCw, Shield, Star, Sparkles, Heart, ShoppingCart } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import bgVideo2 from "../assets/bg-video2.mp4";

const HomePage = () => {
  const { products, loading, toggleWishlist, wishlist, addToCart, showAlert } = useAppContext();
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
      {/* Hero Section with Black & White Design */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800">
        {/* Animated Background Gradient - Monochrome */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-gray-500/10 to-white/5 animate-pulse"></div>

        {/* Floating Decorative Elements - Grayscale */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full blur-3xl"></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero Content */}
        <div
          className={`relative z-10 text-center px-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Sparkles className="w-4 h-4 text-gray-300" />
            <span className="text-gray-200 text-sm font-light tracking-wider">
              New Collection 2024
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extralight tracking-wide mb-6 text-white">
            The Cavoya Collection
          </h1>

          <p className="text-xl md:text-2xl font-light mb-12 text-gray-300 max-w-2xl mx-auto">
            Elegance in every stitch. Discover timeless fashion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleShopNowClick}
              className="group px-10 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                Explore Collections
                <Star className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* NEW IN Section */}
      <section className="relative py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-2 text-gray-900 tracking-wide">
              NEW IN
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
              {products.slice(0, 6).map((product, index) => {
                const isInWishlist = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <div
                        className="relative aspect-[3/4] overflow-hidden bg-white cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        {product.image && product.image.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video
                            src={product.image}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart
                          className={`h-4 w-4 ${isInWishlist
                            ? "fill-gray-900 text-gray-900"
                            : "text-gray-600 hover:text-gray-900"
                            } transition-colors`}
                        />
                      </button>

                      {/* Sale Badge */}
                      {product.discount && (
                        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          SALE
                        </div>
                      )}

                      {/* Quick Add Button - Appears on Hover */}
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                            showAlert("Added to cart successfully!", "success");
                          }}
                          className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Quick Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={handleViewAllClick}
              className="text-gray-700 hover:text-black text-sm font-medium inline-flex items-center gap-2 group"
            >
              View All New In
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="w-full bg-black">
        <div className="relative w-full min-h-[70vh] md:min-h-[80vh] overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src={bgVideo2} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Soft overlay (optional) */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center px-4">
              <h3 className="text-4xl md:text-5xl font-serif text-white mb-4">
                Designed for Movement & Comfort
              </h3>
              <p className="text-lg md:text-xl text-gray-300">
                Experience the Cavoya Difference
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* SHOP BY PRINTS Section */}
      <section className="relative py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-2 text-gray-900 tracking-wide">
              SHOP BY PRINTS
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {/* Print 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 mb-3 overflow-hidden">
                <div
                  className="w-full h-full opacity-60"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      #374151 0px,
                      #374151 10px,
                      #6b7280 10px,
                      #6b7280 20px
                    )`,
                  }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-700 font-medium">
                Geometric
              </p>
            </div>

            {/* Print 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 mb-3 overflow-hidden">
                <div
                  className="w-full h-full opacity-70"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      0deg,
                      #1f2937 0px,
                      #374151 15px,
                      #1f2937 30px
                    )`,
                  }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-700 font-medium">
                Linear
              </p>
            </div>

            {/* Print 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 mb-3 overflow-hidden">
                <div className="w-full h-full opacity-60 bg-gradient-to-br from-gray-200 via-white to-gray-300"></div>
              </div>
              <p className="text-center text-sm text-gray-700 font-medium">
                Minimal
              </p>
            </div>

            {/* Print 4 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 mb-3 overflow-hidden">
                <div
                  className="w-full h-full opacity-50"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      90deg,
                      #111827 0px,
                      #374151 8px,
                      #111827 16px
                    )`,
                  }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-700 font-medium">
                Classic
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BEST SELLERS Section */}
      <section className="relative py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-2 text-gray-900 tracking-wide">
              BEST SELLERS
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {products.filter(product => product.bestSeller === true).slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className="cursor-pointer mb-4"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                      {product.image && product.image.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video
                          src={product.image}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      ₹{product.price}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                      showAlert("Added to cart successfully!", "success");
                    }}
                    className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Quick Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
