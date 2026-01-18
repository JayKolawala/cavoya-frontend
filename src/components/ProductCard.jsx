import React, { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { Heart, Star, ShoppingCart } from "lucide-react";
import AOS from "aos";

const ProductCard = ({ product, onProductClick }) => {
  const { toggleWishlist, wishlist, addToCart, showAlert } = useAppContext();
  const isInWishlist = wishlist.includes(product.id);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  const handleQuickAdd = () => {
    if (!selectedSize) {
      setShowSizeSelector(true);
      return;
    }
    addToCart(product, selectedSize);
    showAlert("Added to cart successfully!", "success");
    setShowSizeSelector(false);
    setSelectedSize("");
  };

  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <>
      {/* Mobile: Horizontal Card Layout */}
      <div className="sm:hidden bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="flex gap-3 p-3">
          {/* Product Image - Left Side */}
          <div className="relative flex-shrink-0 w-24 h-24">
            {product.image && product.image.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={product.image}
                className="w-full h-full object-cover rounded-lg cursor-pointer"
                onClick={() => onProductClick(product)}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg cursor-pointer"
                onClick={() => onProductClick(product)}
              />
            )}
            {product.discount && (
              <div className="absolute top-1 left-1 bg-black text-white text-xs font-bold px-1.5 py-0.5 rounded">
                {product.discount}% OFF
              </div>
            )}
          </div>

          {/* Product Details - Right Side */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Product Title */}
            <h3
              className="text-sm font-medium text-gray-800 line-clamp-2 cursor-pointer mb-1"
              onClick={() => onProductClick(product)}
            >
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center bg-gray-700 text-white text-xs px-1.5 py-0.5 rounded">
                <Star className="w-3 h-3 fill-current mr-0.5" />
                <span className="font-semibold">{product.rating || 4.5}</span>
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews || "85"})
              </span>
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.discount && (
                <span className="bg-gray-700 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  ↓{product.discount}%
                </span>
              )}
              <span className="text-xs text-gray-500 line-through">
                ₹{product.originalPrice || Math.round(product.price * 1.3)}
              </span>
              <span className="text-base font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
            </div>

            {/* Offer Text */}
            {product.offer && (
              <p className="text-xs text-gray-600 mt-1">{product.offer}</p>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
            className="flex-shrink-0 self-start"
          >
            <Heart
              className={`h-5 w-5 ${isInWishlist
                ? "fill-gray-900 text-gray-900"
                : "text-gray-400 hover:text-gray-900"
                } transition-colors`}
            />
          </button>
        </div>
      </div>

      {/* Desktop: Vertical Card Layout */}
      <div
        className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
        data-aos="zoom-in"
      >
        <div className="relative">
          {product.image && product.image.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={product.image}
              className="w-full h-80 object-cover cursor-pointer"
              onClick={() => onProductClick(product)}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover cursor-pointer"
              onClick={() => onProductClick(product)}
            />
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
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

          {/* Quick Add to Cart - Desktop Only */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            {showSizeSelector ? (
              <div className="bg-white p-3 rounded-lg shadow-xl">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Select Size:
                </p>
                <div className="flex gap-2 mb-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${selectedSize === size
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleQuickAdd}
                  disabled={!selectedSize}
                  className="w-full bg-black text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
                >
                  Add to Cart
                </button>
              </div>
            ) : (
              <button
                onClick={handleQuickAdd}
                className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
              >
                <ShoppingCart className="h-4 w-4" />
                Quick Add
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3
            className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-gray-600 transition-colors"
            onClick={() => onProductClick(product)}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center text-gray-700">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating || 4.5)
                    ? "fill-current"
                    : "fill-none text-gray-300"
                    }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({product.reviews || "120"} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Colors */}
          {/* {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
