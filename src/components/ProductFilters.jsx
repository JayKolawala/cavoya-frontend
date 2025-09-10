import React from "react";
import { useAppContext } from "../contexts/AppContext";

const ProductFilters = () => {
  const { selectedCategory, setSelectedCategory, sortBy, setSortBy } =
    useAppContext();

  const categories = [
    { id: "all", name: "All Products" },
    { id: "dresses", name: "Dresses" },
    { id: "tops", name: "Tops" },
    { id: "bottoms", name: "Bottoms" },
    { id: "accessories", name: "Accessories" },
  ];

  const sortOptions = [
    { id: "featured", name: "Featured" },
    { id: "newest", name: "Newest" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "rating", name: "Highest Rated" },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              selectedCategory === category.id
                ? "bg-pink-500 text-white border-pink-500"
                : "bg-white text-gray-600 border-gray-300 hover:border-pink-300"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
