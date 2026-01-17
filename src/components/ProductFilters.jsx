import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { PRODUCT_CATEGORIES } from "../utils/constants";
import {
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";

const ProductFilters = () => {
  const { selectedCategory, setSelectedCategory, sortBy, setSortBy } =
    useAppContext();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  // Temporary state for mobile filter selections (only applied on "Apply" click)
  const [tempCategory, setTempCategory] = React.useState(selectedCategory);
  const [tempSort, setTempSort] = React.useState(sortBy);

  // Update temp state when actual filters change (for sync)
  React.useEffect(() => {
    setTempCategory(selectedCategory);
    setTempSort(sortBy);
  }, [selectedCategory, sortBy]);

  // Build categories array with "All Products" option first
  const categories = [
    { id: "all", name: "All Products" },
    ...PRODUCT_CATEGORIES.map((cat) => ({
      id: cat,
      name: cat,
    })),
  ];

  const sortOptions = [
    { id: "featured", name: "Featured" },
    { id: "newest", name: "Newest" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "rating", name: "Highest Rated" },
  ];

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    if (window.innerWidth < 1024) {
      // On mobile, update temporary state only
      setTempCategory(categoryId);
    } else {
      // On desktop, apply immediately
      setSelectedCategory(categoryId);
    }
  };

  // Handle sort selection
  const handleSortSelect = (sortId) => {
    if (window.innerWidth < 1024) {
      // On mobile, update temporary state only
      setTempSort(sortId);
    } else {
      // On desktop, apply immediately
      setSortBy(sortId);
    }
  };

  // Apply filters on mobile
  const handleApplyFilters = () => {
    setSelectedCategory(tempCategory);
    setSortBy(tempSort);
    setIsMobileFiltersOpen(false);
  };

  // Clear all filters
  const handleClearAll = () => {
    if (window.innerWidth < 1024) {
      setTempCategory("all");
      setTempSort("featured");
    } else {
      setSelectedCategory("all");
      setSortBy("featured");
    }
  };

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full flex items-center justify-between px-5 py-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-blush-600" />
            <span className="font-semibold text-gray-800">Filters & Sort</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-600 transition-transform ${isMobileFiltersOpen ? "rotate-180" : ""
              }`}
          />
        </button>
      </div>

      {/* Filters Sidebar */}
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ${isMobileFiltersOpen ? "block" : "hidden lg:block"
          } lg:sticky lg:top-24`}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blush-50 to-tangerine-50 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blush-600" />
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={handleClearAll}
              className="text-xs text-blush-600 hover:text-blush-800 font-medium hover:underline transition-colors"
            >
              Clear All
            </button>
          </div>
          <p className="text-sm text-gray-600">Refine your search</p>
        </div>

        <div className="p-6 space-y-8 max-h-[calc(100vh-250px)] overflow-y-auto">
          {/* Categories Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Categories
              </h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {categories.length}
              </span>
            </div>

            {/* Category List */}
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${(window.innerWidth < 1024
                    ? tempCategory
                    : selectedCategory) === category.id
                    ? "bg-gradient-to-r from-tangerine-500 to-blush-500 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{category.name}</span>
                    {(window.innerWidth < 1024
                      ? tempCategory
                      : selectedCategory) === category.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Sort Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpDown className="w-4 h-4 text-blush-600" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Sort By
              </h3>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSortSelect(option.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${(window.innerWidth < 1024 ? tempSort : sortBy) === option.id
                    ? "bg-blush-50 text-blush-800 border-2 border-blush-400"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{option.name}</span>
                    {(window.innerWidth < 1024 ? tempSort : sortBy) ===
                      option.id && (
                        <div className="w-2 h-2 bg-blush-500 rounded-full"></div>
                      )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Summary */}
          {/* <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Active Filters
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold text-gray-900">
                  {selectedCategory === "all" ? "All" : selectedCategory}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sort:</span>
                <span className="font-semibold text-gray-900">
                  {sortOptions.find((opt) => opt.id === sortBy)?.name ||
                    "Featured"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCategory("all");
                setSortBy("featured");
              }}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-blush-700 hover:bg-white border border-gray-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Reset All
            </button>
          </div> */}

          {/* Mobile Apply Button */}
          <div className="lg:hidden">
            <button
              onClick={handleApplyFilters}
              className="w-full py-3 bg-gradient-to-r from-tangerine-500 to-blush-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;
