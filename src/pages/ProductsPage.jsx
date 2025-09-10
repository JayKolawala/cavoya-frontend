import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import ProductFilters from "../components/ProductFilters";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

const ProductsPage = () => {
  const { sortedProducts } = useAppContext();
  const [_selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`); // Add the product ID to the URL
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-light mb-8">Shop All Products</h1>
      <ProductFilters />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={handleProductClick}
          />
        ))}
      </div>
      {sortedProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            No products found matching your criteria.
          </p>
        </div>
      )}
    </section>
  );
};

export default ProductsPage;
