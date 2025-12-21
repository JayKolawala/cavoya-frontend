import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import ProductFilters from "../components/ProductFilters";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { Sparkles, Package } from "lucide-react";

const ProductsPage = () => {
  const { sortedProducts, productsLoading } = useAppContext();
  const [_selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#4a1942] text-white py-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-tangerine-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blush-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Header Content */}
        <div className="relative z-10 container mx-auto text-center">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Sparkles className="w-4 h-4 text-butter-300" />
            <span className="text-butter-100 text-sm font-light tracking-wider">
              Curated Collection
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extralight tracking-wide mb-4">
            Shop All Products
          </h1>

          <p className="text-lg md:text-xl font-light text-gray-200 max-w-2xl mx-auto">
            Discover our complete collection of premium fashion
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8">
          <ProductFilters />
        </div>

        {/* Loading State */}
        {productsLoading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {/* Products Grid */}
        {!productsLoading && sortedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${(index % 8) * 100}ms` }}
              >
                <ProductCard
                  product={product}
                  onProductClick={handleProductClick}
                />
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Empty State */}
        {!productsLoading && sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-light text-gray-800 mb-3">
              No Products Found
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              We couldn't find any products matching your criteria.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-blush-500/30 transition-all duration-300 transform hover:scale-105"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
