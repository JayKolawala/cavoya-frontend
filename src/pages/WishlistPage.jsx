import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, products, toggleWishlist } = useAppContext();

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  if (wishlistProducts.length === 0) {
    return (
      <section className="container mx-auto px-4 pt-28 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="h-24 w-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-light mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Save items you love for later!</p>
          <button
            onClick={() => navigate("/products")}
            className="px-8 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 pt-24">
      <h1 className="text-3xl font-light mb-8">
        Your Wishlist ({wishlistProducts.length} items)
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 object-cover"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md"
              >
                <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium mb-2">{product.name}</h3>
              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm text-gray-600">
                  {product.rating}
                </span>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg font-semibold text-pink-500">
                  ₹{product.price}
                </span>
                {product.isSale && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              <button className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WishlistPage;
