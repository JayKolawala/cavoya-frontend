import React, { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { Heart, Star, Sparkles, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, products, toggleWishlist, addToCart } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  if (wishlistProducts.length === 0) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-gray-500/10 to-white/5 animate-pulse"></div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400/5 rounded-full blur-3xl animate-pulse delay-700"></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Empty Wishlist Content */}
        <div className={`relative z-10 text-center px-4 max-w-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8 inline-flex items-center justify-center w-32 h-32 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Heart className="h-16 w-16 text-gray-300" />
          </div>

          <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
            Your Wishlist is Empty
          </h2>

          <p className="text-xl text-gray-300 mb-10 font-light">
            Save items you love and keep track of your favorites!
          </p>

          <button
            onClick={() => navigate("/products")}
            className="group px-10 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="flex items-center gap-2">
              Start Shopping
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
      <div className="absolute top-20 right-10 w-96 h-96 bg-gray-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-gray-300/20 rounded-full blur-3xl"></div>

      <section className={`relative container mx-auto px-4 pt-28 pb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-4">
            <Heart className="w-4 h-4 text-gray-700 fill-gray-700" />
            <span className="text-gray-700 text-sm font-semibold tracking-wider">
              YOUR FAVORITES
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-3 text-gray-900">
            My Wishlist
          </h1>
          <p className="text-gray-600 text-lg">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} you love
          </p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistProducts.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                  title="Remove from wishlist"
                >
                  <Heart className="h-5 w-5 fill-gray-900 text-gray-900" />
                </button>

                {/* Sale Badge */}
                {product.isSale && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-bold rounded-full shadow-lg">
                    SALE
                  </div>
                )}

                {/* Quick View on Hover */}
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white text-gray-800 font-semibold rounded-full opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all duration-300 shadow-lg hover:bg-gray-50"
                >
                  Quick View
                </button>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>

                {/* Rating */}
                {(product.reviews && product.reviews > 0) ? (
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating)
                          ? 'fill-gray-700 text-gray-700'
                          : 'fill-gray-200 text-gray-200'
                          }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600 font-medium">
                      {product.rating}
                    </span>
                  </div>
                ) : (
                  <div className="mb-3">
                    <span className="text-gray-400 text-xs italic">
                      No ratings yet
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.isSale && product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    addToCart(product);
                    // Optionally show a toast notification here
                  }}
                  className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WishlistPage;
