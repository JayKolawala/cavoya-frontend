// components/Header.jsx
import React, { useEffect, useState } from "react";
import { ShoppingCart, Search, Heart, Menu, ChevronDown } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { getCategoryMap } from "../utils/categoryHelpers";
import logoBlack from "../../src/assets/Cavoya_Logo.svg";

// ─── Nav configuration objects ──────────────────────────────────────────────

const STYLES_ITEMS = [
  {
    label: "Dresses",
    categoryKey: "dresses",
    path: "/products?category=dresses",
  },
  {
    label: "Co-ord Sets",
    categoryKey: "coord-sets",
    path: "/products?category=coord-sets",
  },
  { label: "Tops", categoryKey: "tops", path: "/products?category=tops" },
  {
    label: "Bottomwear",
    categoryKey: "bottomwear",
    path: "/products?category=bottomwear",
  },
  {
    label: "Jumpsuits",
    categoryKey: "jumpsuits",
    path: "/products?category=jumpsuits",
  },
];

const COLLECTION_ITEMS = [
  // Ocean and Floral commented out as not decided yet
  {
    label: "Solset",
    categoryKey: "solset",
    collectionKey: "solset",
    path: "/products?collection=solset",
  },
  {
    label: "Floral",
    categoryKey: "floral",
    collectionKey: "floral",
    path: "/products?collection=floral",
  },
];

// ─── Desktop chevron SVG (reused) ────────────────────────────────────────────
const ChevronSVG = () => (
  <svg
    className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

// ─── Mobile accordion dropdown ───────────────────────────────────────────────
const MobileAccordion = ({ label, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <button
        className="text-left text-black font-medium flex items-center gap-3"
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-2 pl-4">{children}</div>
      </div>
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────

const Header = () => {
  const {
    getCartItemsCount,
    searchQuery,
    setSearchQuery,
    showMobileMenu,
    setShowMobileMenu,
    setSelectedCategory,
    setSelectedCollection,
    setSelectedNewArrivals,
  } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const isProductsPage = location.pathname === "/products";
  const isHomePage = location.pathname === "/";

  const categoryMap = getCategoryMap();

  const handleNavigateWithFilters = (
    category,
    collection,
    newArrivals,
    path,
    closeMobileMenu = false,
  ) => {
    setSelectedCategory(category);
    setSelectedCollection(collection);
    setSelectedNewArrivals(newArrivals);
    if (closeMobileMenu) setShowMobileMenu(false);
    navigate(path);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setShowMobileMenu(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setShowMobileMenu]);

  return (
    <>
      {/* Mobile Menu Backdrop */}
      {showMobileMenu && (
        <div
          className="max-lg:bg-black/50 min-h-screen fixed top-0 left-0 w-full transition duration-300 ease-linear z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <header
        className={`transition duration-300 ease-linear fixed top-0 z-50 w-full ${
          isScrolled || !isHomePage
            ? "bg-white shadow-lg shadow-black/10"
            : "bg-transparent text-white"
        }`}
      >
        <div className="w-full mx-auto">
          {/* ── Main nav ─────────────────────────────────────────── */}
          <nav
            className={`flex justify-between items-center py-4 px-4 lg:px-4 z-10 relative ${
              showMobileMenu || isScrolled ? "bg-white" : ""
            }`}
          >
            {/* Hamburger */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden hover:text-gray-600 transition-colors"
              aria-label="Menu"
            >
              <Menu
                className={`h-6 w-6 ${
                  !isHomePage || showMobileMenu || isScrolled
                    ? "text-black"
                    : "text-white"
                }`}
              />
            </button>

            {/* Logo */}
            <div
              className="text-2xl font-bold text-gray-600"
              onClick={() => navigate("/")}
            >
              <img
                src={logoBlack}
                alt="cavoya-logo"
                className="h-10 w-40 rounded-full object-cover cursor-pointer"
              />
            </div>

            {/* ── Desktop Navigation ─────────────────────────────── */}
            <div className="hidden lg:flex space-x-6">
              <Link to="/" className="hover:text-gray-500">
                Home
              </Link>
              <button
                onClick={() =>
                  handleNavigateWithFilters("all", null, false, "/products")
                }
                className="hover:text-gray-500"
              >
                Shop All
              </button>
              <button
                onClick={() =>
                  handleNavigateWithFilters(
                    "all",
                    null,
                    true,
                    "/products?newArrivals=true",
                  )
                }
                className="hover:text-gray-500"
              >
                New Arrivals
              </button>

              {/* Shop by Styles — desktop hover dropdown */}
              <div className="relative group">
                <span className="hover:text-gray-500 transition-colors cursor-pointer flex items-center">
                  Shop by styles
                  <ChevronSVG />
                </span>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                  {STYLES_ITEMS.map((item, i) => (
                    <button
                      key={item.categoryKey}
                      onClick={() =>
                        handleNavigateWithFilters(
                          categoryMap[item.categoryKey],
                          null,
                          false,
                          item.path,
                        )
                      }
                      className={`w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black ${
                        i === 0 || i === STYLES_ITEMS.length - 1
                          ? "hover:rounded-lg"
                          : ""
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shop by Collection — desktop hover dropdown */}
              <div className="relative group">
                <span className="hover:text-gray-500 transition-colors cursor-pointer flex items-center">
                  Shop by collection
                  <ChevronSVG />
                </span>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                  {COLLECTION_ITEMS.map((item) => (
                    <button
                      key={item.collectionKey}
                      onClick={() =>
                        handleNavigateWithFilters(
                          categoryMap[item.categoryKey],
                          categoryMap[item.collectionKey],
                          false,
                          item.path,
                        )
                      }
                      className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:rounded-lg hover:text-black"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <Link to="/about" className="hover:text-gray-500">
                About
              </Link>
              <Link to="/contact" className="hover:text-gray-500">
                Contact Us
              </Link>
            </div>

            {/* Icons */}
            <div
              className={`flex items-center space-x-4 ${
                showMobileMenu || isScrolled || !isHomePage
                  ? "text-black"
                  : "text-white"
              }`}
            >
              <button
                onClick={() => navigate("/wishlist")}
                className="hover:text-gray-500 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="h-6 w-6" />
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="hover:text-gray-500 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* ── Mobile Menu ──────────────────────────────────────── */}
          <div
            className={`lg:hidden border-t border-gray-200 transition-all duration-500 ease-in-out bg-white overflow-hidden ${
              showMobileMenu ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col space-y-4 p-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              {/* Simple links */}
              <Link
                to="/"
                className="text-left text-black hover:text-gray-500"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <button
                onClick={() =>
                  handleNavigateWithFilters(
                    "all",
                    null,
                    false,
                    "/products",
                    true,
                  )
                }
                className="text-left text-black hover:text-gray-500"
              >
                Shop All
              </button>
              <button
                onClick={() =>
                  handleNavigateWithFilters(
                    "all",
                    null,
                    true,
                    "/products?newArrivals=true",
                    true,
                  )
                }
                className="text-left text-black hover:text-gray-500"
              >
                New Arrivals
              </button>

              {/* Shop by Styles — mobile accordion */}
              <MobileAccordion label="Shop by style">
                {STYLES_ITEMS.map((item) => (
                  <button
                    key={item.categoryKey}
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap[item.categoryKey],
                        null,
                        false,
                        item.path,
                        true,
                      )
                    }
                    className="text-left text-gray-600 hover:text-black"
                  >
                    {item.label}
                  </button>
                ))}
              </MobileAccordion>

              {/* Shop by Collection — mobile accordion */}
              <MobileAccordion label="Shop by collection">
                {COLLECTION_ITEMS.map((item) => (
                  <button
                    key={item.collectionKey}
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap[item.categoryKey],
                        categoryMap[item.collectionKey],
                        false,
                        item.path,
                        true,
                      )
                    }
                    className="text-left text-gray-600 hover:text-black"
                  >
                    {item.label}
                  </button>
                ))}
              </MobileAccordion>

              {/* More links */}
              <Link
                to="/about"
                className="text-left text-black hover:text-gray-500"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-left text-black hover:text-gray-500"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
