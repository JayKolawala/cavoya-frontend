import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { isVideo } from "../utils/mediaHelpers";

const ProductCard = ({ product, onProductClick }) => {
  const { toggleWishlist, wishlist, addToCart, showAlert } = useAppContext();
  const isInWishlist = wishlist.includes(product.id);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group">
      <div className="relative">
        <div
          className="relative aspect-[3/4] overflow-hidden bg-white cursor-pointer"
          onClick={() => onProductClick(product)}
        >
          {isVideo(product.image) ? (
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
            className={`h-4 w-4 ${
              isInWishlist
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

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
