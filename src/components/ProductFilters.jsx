import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { PRODUCT_CATEGORIES } from "../utils/constants";
import { SlidersHorizontal, ArrowUpDown, Filter, X, ChevronDown, Sparkles } from "lucide-react";

const ProductFilters = () => {
  const { selectedCategory, setSelectedCategory, sortBy, setSortBy } =
    useAppContext();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  // Build categories array with "All Products" option first
  const categories = [
    { id: "all", name: "All Products", count: 42 },
    ...PRODUCT_CATEGORIES.map(cat => ({
      id: cat,
      name: cat,
      count: Math.floor(Math.random() * 20) + 5
    }))
  ];

  const sortOptions = [
    { id: "featured", name: "Featured", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: "newest", name: "Newest" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "rating", name: "Highest Rated" },
  ];

  // Get current sort option name for mobile display
  const currentSortName = sortOptions.find(opt => opt.id === sortBy)?.name || "Featured";

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-md border border-gray-200"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blush-600" />
            <span className="font-medium text-gray-800">Filters & Sorting</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm px-2 py-1 rounded-full bg-blush-50 text-blush-700">
              {selectedCategory === "all" ? "All" : selectedCategory}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isMobileFiltersOpen ? "rotate-180" : ""}`} />
          </div>
        </button>
      </div>

      {/* Filters Container */}
      <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 mb-8 transition-all duration-300 ${isMobileFiltersOpen ? "block" : "hidden lg:block"}`}>

        {/* Header with Clear Button */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blush-600" />
              Refine Products
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Filter by category and sort by preference
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSortBy("featured");
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-blush-700 hover:bg-blush-50 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Section */}
          <div className="flex-1">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  Categories
                  <span className="text-xs font-normal bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {categories.length}
                  </span>
                </span>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="text-xs text-blush-600 hover:text-blush-800 font-medium"
                >
                  Select all
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Browse products by category
              </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    if (window.innerWidth < 1024) {
                      setIsMobileFiltersOpen(false);
                    }
                  }}
                  className={`group relative p-4 rounded-xl text-left transition-all duration-300 ${selectedCategory === category.id
                    ? "bg-gradient-to-br from-tangerine-50 to-blush-50 border-2 border-blush-400 shadow-lg shadow-blush-200/50"
                    : "bg-gray-50/80 border border-gray-200 hover:border-blush-300 hover:bg-blush-50 hover:shadow-md"
                    }`}
                >
                  {/* Selected indicator */}
                  {selectedCategory === category.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-tangerine-500 to-blush-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}

                  <div className="font-medium text-gray-800 group-hover:text-blush-800">
                    {category.name}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === category.id
                      ? "bg-blush-100 text-blush-700"
                      : "bg-gray-200 text-gray-600"
                      }`}>
                      {category.count} items
                    </span>
                    {selectedCategory === category.id && (
                      <div className="w-2 h-2 rounded-full bg-blush-500 animate-pulse"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

          {/* Sort Section */}
          <div className="lg:w-80 xl:w-96">
            <div className="mb-4">
              <span className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-blush-600" />
                Sort Options
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Arrange products by your preference
              </p>
            </div>

            {/* Sort Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 mb-6">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortBy(option.id);
                    if (window.innerWidth < 1024) {
                      setIsMobileFiltersOpen(false);
                    }
                  }}
                  className={`group flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 ${sortBy === option.id
                    ? "bg-blush-50 border-blush-400 text-blush-800 shadow-md"
                    : "bg-white border-gray-200 text-gray-700 hover:border-blush-300 hover:bg-blush-50"
                    }`}
                >
                  {option.icon && <span className={`${sortBy === option.id ? "text-blush-600" : "text-gray-400"}`}>{option.icon}</span>}
                  <span className="text-sm font-medium truncate">{option.name}</span>
                  {sortBy === option.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blush-500 ml-auto"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Current Selection Display */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Currently selected</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{currentSortName}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedCategory === "all"
                      ? "All product categories"
                      : `Category: ${selectedCategory}`
                    }
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSortBy("featured");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-blush-700 hover:bg-blush-50 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Mobile Apply Button */}
            <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-tangerine-500 to-blush-500 text-white font-medium rounded-xl shadow-lg shadow-blush-300/50 hover:shadow-blush-300/70 transition-shadow"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Bar (Desktop) */}
        <div className="hidden lg:flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">Active filters:</div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-blush-100 text-blush-800 text-sm rounded-full flex items-center gap-1.5">
                {selectedCategory === "all" ? "All Products" : selectedCategory}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="hover:text-blush-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
              <span className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded-full flex items-center gap-1.5">
                {currentSortName}
                <button
                  onClick={() => setSortBy("featured")}
                  className="hover:text-gray-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-800">24</span> of <span className="font-semibold text-gray-800">128</span> products
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;