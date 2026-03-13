import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { PRODUCT_CATEGORIES } from "../utils/constants";
import {
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  X,
  ChevronDown,
  Layers,
  Palette,
} from "lucide-react";
import { API_BASE_URL } from "../utils/apiHelpers";

const ProductFilters = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    selectedCollection,
    setSelectedCollection,
    selectedPrint,
    setSelectedPrint,
    collections, // Pull collections from context
  } = useAppContext();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  // Temporary state for mobile filter selections (only applied on "Apply" click)
  const [tempCategory, setTempCategory] = React.useState(selectedCategory);
  const [tempSort, setTempSort] = React.useState(sortBy);
  const [tempCollection, setTempCollection] = React.useState(selectedCollection);
  const [tempPrint, setTempPrint] = React.useState(selectedPrint);

  // Collections & prints state
  const [prints, setPrints] = React.useState([]);

  // Active collection ID (desktop uses selectedCollection directly, mobile uses tempCollection)
  // This is now an ObjectId string instead of a name string
  const activeCollection = window.innerWidth < 1024 ? tempCollection : selectedCollection;

  // Fetch prints whenever active collection changes
  React.useEffect(() => {
    const colId = activeCollection;
    if (!colId) { setPrints([]); return; }
    // activeCollection is now the _id
    const col = collections.find((c) => c._id === colId);
    if (!col) return;
    fetch(`${API_BASE_URL}/collections/${col._id}/prints`)
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.data ?? data.prints ?? [];
        // Only show active prints
        setPrints(arr.filter((p) => p.isActive !== false));
      })
      .catch(console.error);
  }, [activeCollection, collections]);

  // Update temp state when actual filters change (for sync)
  React.useEffect(() => {
    setTempCategory(selectedCategory);
    setTempSort(sortBy);
    setTempCollection(selectedCollection);
    setTempPrint(selectedPrint);
  }, [selectedCategory, sortBy, selectedCollection, selectedPrint]);

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

  const isMobile = () => window.innerWidth < 1024;

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    if (isMobile()) {
      setTempCategory(categoryId);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  // Handle sort selection
  const handleSortSelect = (sortId) => {
    if (isMobile()) {
      setTempSort(sortId);
    } else {
      setSortBy(sortId);
    }
  };

  // Handle collection selection (toggles off if already selected)
  // Now uses col._id instead of col.name
  const handleCollectionSelect = (colId) => {
    const next = activeCollection === colId ? null : colId;
    if (isMobile()) {
      setTempCollection(next);
      setTempPrint(null); // reset print when collection changes
    } else {
      setSelectedCollection(next);
      setSelectedPrint(null);
    }
  };

  // Handle print selection — store the print _id (not name) because
  // AppContext sends selectedPrint to the API as ?printId=<ObjectId>
  const handlePrintSelect = (printId) => {
    const current = isMobile() ? tempPrint : selectedPrint;
    const next = current === printId ? null : printId;
    if (isMobile()) {
      setTempPrint(next);
    } else {
      setSelectedPrint(next);
    }
  };

  // Apply filters on mobile
  const handleApplyFilters = () => {
    setSelectedCategory(tempCategory);
    setSortBy(tempSort);
    setSelectedCollection(tempCollection);
    setSelectedPrint(tempPrint);
    setIsMobileFiltersOpen(false);
  };

  // Clear all filters
  const handleClearAll = () => {
    if (isMobile()) {
      setTempCategory("all");
      setTempSort("featured");
      setTempCollection(null);
      setTempPrint(null);
    } else {
      setSelectedCategory("all");
      setSortBy("featured");
      setSelectedCollection(null);
      setSelectedPrint(null);
    }
  };

  const activePrint = isMobile() ? tempPrint : selectedPrint;

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full flex items-center justify-between px-5 py-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-700" />
            <span className="font-semibold text-gray-800">Filters &amp; Sort</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-600 transition-transform ${isMobileFiltersOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Filters Sidebar */}
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ${isMobileFiltersOpen ? "block" : "hidden lg:block"} lg:sticky lg:top-24`}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-600 hover:text-gray-900 font-medium hover:underline transition-colors"
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
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${(isMobile() ? tempCategory : selectedCategory) === category.id
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{category.name}</span>
                    {(isMobile() ? tempCategory : selectedCategory) === category.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Collection Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-gray-700" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Collection
              </h3>
            </div>

            <div className="space-y-2">
              {collections.map((col) => (
                <button
                  key={col._id}
                  onClick={() => handleCollectionSelect(col._id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${activeCollection === col._id
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{col.name}</span>
                    {activeCollection === col._id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
              {collections.length === 0 && (
                <p className="text-xs text-gray-400 px-2">No collections available</p>
              )}
            </div>
          </div>

          {/* Print Section — only visible when a collection is selected */}
          {activeCollection && prints.length > 0 && (
            <>
              <div className="border-t border-gray-200"></div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-4 h-4 text-gray-700" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Print Type
                  </h3>
                </div>

                <div className="space-y-2">
                  {prints.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => handlePrintSelect(p._id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${activePrint === p._id
                        ? "bg-black text-white shadow-md"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                          />
                        )}
                        <span className="font-medium text-sm">{p.name}</span>
                        {activePrint === p._id && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Sort Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpDown className="w-4 h-4 text-gray-700" />
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
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${(isMobile() ? tempSort : sortBy) === option.id
                    ? "bg-gray-100 text-gray-900 border-2 border-gray-400"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{option.name}</span>
                    {(isMobile() ? tempSort : sortBy) === option.id && (
                      <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Apply Button */}
          <div className="lg:hidden">
            <button
              onClick={handleApplyFilters}
              className="w-full py-3 bg-black text-white font-semibold rounded-xl shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all"
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
