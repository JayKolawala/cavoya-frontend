import React, { memo, useMemo } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import useCartStore from "../store/useCartStore";
import useWishlistStore from "../store/useWishlistStore";
import useUIStore from "../store/useUIStore";
import { isVideo } from "../utils/mediaHelpers";

const ProductCard = memo(({ product, onProductClick }) => {
  const { toggleWishlist, wishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { showCustomAlert } = useUIStore();
  const isInWishlist = wishlist.includes(product.id);

  const hasSizes = useMemo(
    () => product.sizes?.length > 0 || product.topSizes?.length > 0 || product.bottomSizes?.length > 0,
    [product.sizes, product.topSizes, product.bottomSizes]
  );

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (hasSizes) {
      onProductClick(product);
    } else {
      addToCart(product);
      showCustomAlert("Added to cart successfully!", "success");
    }
  };

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
              loading="lazy"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <button
          onClick={handleWishlistClick}
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

        {product.discount && (
          <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            SALE
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleActionClick}
            className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
          >
            <ShoppingCart className="h-4 w-4" />
            {hasSizes ? "Select Size" : "Quick Add"}
          </button>
        </div>
      </div>

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
}, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.name === nextProps.product.name &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.image === nextProps.product.image &&
    prevProps.product.sizes?.length === nextProps.product.sizes?.length &&
    prevProps.product.originalPrice === nextProps.product.originalPrice
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
