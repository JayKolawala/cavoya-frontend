import React, { useState, useEffect, useMemo, useRef } from "react";
import useProductStore from "../store/useProductStore";
import { PRODUCT_CATEGORIES } from "../utils/constants";
import ProductFilters from "../components/ProductFilters";
import ProductCard from "../components/ProductCard";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import ProductSkeleton from "../components/ProductSkeleton";
import { Sparkles, Package } from "lucide-react";
import { getCategoryMap } from "../utils/categoryHelpers";
import AOS from "aos";

const ProductsPage = () => {
  const {
    products,
    productsLoading,
    isRefetching,
    hasMore,
    loadMoreProducts,
    setSelectedCategory,
    setSelectedCollection,
    setSelectedPrint,
    setSelectedNewArrivals,
    resetAndFetchProducts,
    sortBy,
    collections,
    fetchCollections,
  } = useProductStore();
  const [_selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (collections.length === 0) {
      fetchCollections();
    }
  }, [collections.length, fetchCollections]);

  const sortedProducts = useMemo(() => {
    let result = [...products];
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    }
    return result;
  }, [products, sortBy]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Get category mapping from shared utility
  const categoryMap = getCategoryMap();

  // Get filter type from URL query parameters
  // Support both new ID-based params (collectionId, printId) and legacy name-based params
  const category = searchParams.get("category");
  const collectionId = searchParams.get("collectionId");
  const printId = searchParams.get("printId");
  // Legacy name-based params (kept for backward-compat with old bookmarked URLs)
  const collectionName = searchParams.get("collection");
  const printName = searchParams.get("print");
  const newArrivals = searchParams.get("newArrivals");

  // Resolve display names from the context collections array
  const resolvedCollection = collectionId
    ? collections.find((c) => c._id === collectionId)
    : collectionName
      ? collections.find((c) => c.name === collectionName)
      : null;

  const collectionDisplayName = resolvedCollection?.name || collectionName || null;

  // Memoized dynamic title based on URL parameters - recalculates when params change
  const pageTitle = useMemo(() => {
    if (newArrivals === "true") return "New Arrivals";
    if (printId || printName) return `${collectionDisplayName ? collectionDisplayName + " — " : ""}Print Collection`;
    if (collectionDisplayName) return collectionDisplayName.charAt(0).toUpperCase() + collectionDisplayName.slice(1);
    if (category && category !== "all") {
      const categoryDisplayMap = {
        dresses: "Dresses",
        "coord-sets": "Co-ord Sets",
        tops: "Tops",
        bottomwear: "Bottomwear",
        jumpsuits: "Jumpsuits",
      };
      return (
        categoryDisplayMap[category] ||
        category.charAt(0).toUpperCase() + category.slice(1)
      );
    }
    return "Shop All Products";
  }, [category, collectionId, collectionName, printId, printName, newArrivals, collectionDisplayName]);

  const pageSubtitle = useMemo(() => {
    if (newArrivals === "true") {
      return "Explore our latest collection of premium fashion";
    }
    if (printId || printName) return `Showing products from the ${collectionDisplayName || ""} collection`;
    if (collectionDisplayName) return `Explore our ${collectionDisplayName} collection`;
    if (category && category !== "all") {
      return `Browse our collection of premium ${category.replace("-", " ")}`;
    }
    return "Discover our complete collection of premium fashion";
  }, [category, collectionId, collectionName, printId, printName, newArrivals, collectionDisplayName]);

  // Apply filters from URL params to context state to trigger API refetch
  // Supports new ID-based params (collectionId, printId) AND legacy name-based params
  useEffect(() => {
    // Resolve legacy name-based collection param to its _id
    const resolvedCollectionId =
      collectionId ||
      (collectionName && collections.length > 0
        ? collections.find((c) => c.name === collectionName)?._id
        : null);

    if (newArrivals === "true") {
      setSelectedNewArrivals(true);
      setSelectedCollection(null);
      setSelectedPrint(null);
      setSelectedCategory("all");
      resetAndFetchProducts({ newArrivals: true });
    } else if (resolvedCollectionId && (printId || printName)) {
      setSelectedCollection(resolvedCollectionId);
      setSelectedPrint(printId || printName);
      setSelectedCategory("all");
      setSelectedNewArrivals(false);
      resetAndFetchProducts({ collection: resolvedCollectionId, printId: printId || printName });
    } else if (resolvedCollectionId) {
      setSelectedCollection(resolvedCollectionId);
      setSelectedPrint(null);
      setSelectedCategory("all");
      setSelectedNewArrivals(false);
      resetAndFetchProducts({ collection: resolvedCollectionId });
    } else if (category) {
      const dbCategoryName = categoryMap[category] || category;
      setSelectedCategory(dbCategoryName);
      setSelectedCollection(null);
      setSelectedPrint(null);
      setSelectedNewArrivals(false);
      resetAndFetchProducts({ category: dbCategoryName });
    } else {
      setSelectedCategory("all");
      setSelectedCollection(null);
      setSelectedPrint(null);
      setSelectedNewArrivals(false);
      resetAndFetchProducts({ category: "all" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, collectionId, collectionName, printId, printName, newArrivals, collections]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white pb-20 pt-32 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gray-400/5 rounded-full blur-3xl animate-pulse delay-700"></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Header Content */}
        <div className="relative z-10 container mx-auto text-center" data-aos="fade-down">


          <h1 className="text-4xl md:text-6xl font-extralight tracking-wide mb-4">
            {pageTitle}
          </h1>

          <p className="text-lg md:text-xl font-light text-gray-300 max-w-2xl mx-auto">
            {pageSubtitle}
          </p>
        </div>
      </div>

      {/* Main Content - 25/75 Layout */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - 25% */}
          <aside className="lg:w-1/4 lg:min-w-[280px]">
            <ProductFilters />
          </aside>

          {/* Products Section - 75% */}
          <main className="lg:w-3/4 flex-1">
            {/* Full-page skeleton — shown when products are loading */}
            {productsLoading && !isRefetching && (
              <ProductSkeleton count={6} columns="full" />
            )}

            {/* Slim refetch indicator — shown during filter/category changes */}
            {isRefetching && (
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 animate-pulse rounded-full" />
              </div>
            )}

            {/* Products Grid */}
            {sortedProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {sortedProducts.map((product, index) => {
                    return (
                      <div
                        key={product.id}
                        className="animate-slide-up"
                        style={{ animationFillMode: "both" }}
                      >
                        <ProductCard
                          product={product}
                          onProductClick={handleProductClick}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Load More Button */}
                {hasMore ? (
                  <div className="flex justify-center pb-12">
                    <button
                      onClick={loadMoreProducts}
                      disabled={productsLoading}
                      className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {productsLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Loading...
                        </>
                      ) : (
                        "Load More Products"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center pb-12">
                    <div className="inline-block px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full">
                      <p className="text-gray-600 font-light text-lg">
                        ✨ You've seen all products
                      </p>
                    </div>
                  </div>
                )}
              </>
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
                  className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
