import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { Heart, Star } from "lucide-react";

const ProductCard = ({ product, onProductClick }) => {
  const { toggleWishlist, wishlist } = useAppContext();
  const isInWishlist = wishlist.includes(product.id);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover cursor-pointer"
          onClick={() => onProductClick(product)}
        />
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart
            className={`h-4 w-4 ${
              isInWishlist ? "fill-pink-500 text-pink-500" : "text-gray-400"
            }`}
          />
        </button>
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 text-xs rounded">
            NEW
          </span>
        )}
        {product.isSale && (
          <span className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs rounded mt-8">
            SALE
          </span>
        )}
      </div>
      <div className="p-4 text-center">
        <h3
          className="text-xl font-medium cursor-pointer hover:text-pink-500"
          onClick={() => onProductClick(product)}
        >
          {product.name}
        </h3>
        <div className="flex items-center justify-center mt-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="ml-1 text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <span className="text-lg font-semibold text-pink-500">
            ₹{product.price}
          </span>
          {product.isSale && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
        <div className="flex justify-center space-x-1 mt-2">
          {product.colors.map((color, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border border-gray-300 bg-${color}-300`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
