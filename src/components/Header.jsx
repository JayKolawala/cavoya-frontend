// components/Header.jsx
import React, { useEffect, useState } from "react";
import { ShoppingCart, Search, Heart, Menu, ChevronDown } from "lucide-react";
import useCartStore from "../store/useCartStore";
import useProductStore from "../store/useProductStore";
import useUIStore from "../store/useUIStore";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { getCategoryMap } from "../utils/categoryHelpers";
import logoBlack from "../../src/assets/cavoya_black.PNG";
import logoWhite from "../../src/assets/cavoya_white.PNG";

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
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col space-y-2 pl-4">{children}</div>
      </div>
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────

const Header = () => {
  const { getCartItemsCount } = useCartStore();
  const {
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setSelectedCollection,
    setSelectedNewArrivals,
  } = useProductStore();
  const { showMobileMenu, setShowMobileMenu } = useUIStore();

  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [collectionItems, setCollectionItems] = useState([]);
  const [collectionPrints, setCollectionPrints] = useState({});
  const [hoveredColId, setHoveredColId] = useState(null);

  const lightHeaderPages = ["/product", "/cart", "/checkout", "/wishlist", "/rate-order"];
  const isLightHeaderPage = lightHeaderPages.some((path) =>
    location.pathname.startsWith(path),
  );

  const categoryMap = getCategoryMap();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://cavoya-backend.onrender.com/api";

  // Fetch active collections from API
  useEffect(() => {
    fetch(`${API_BASE_URL}/collections`)
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data)
          ? data
          : (data.data ?? data.collections ?? []);
        setCollectionItems(arr.filter((c) => c.isActive !== false));
      })
      .catch(console.error);
  }, [API_BASE_URL]);

  // Fetch prints for a specific collection on demand
  const fetchPrintsForCollection = (colId) => {
    if (collectionPrints[colId]) return; // Already cached

    fetch(`${API_BASE_URL}/collections/${colId}/prints`)
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data)
          ? data
          : (data.data ?? data.prints ?? []);
        setCollectionPrints((prev) => ({ ...prev, [colId]: arr }));
      })
      .catch(console.error);
  };

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
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? "bg-white shadow-lg shadow-black/10 text-black"
          : showMobileMenu
            ? "bg-transparent text-black"
            : isLightHeaderPage
              ? "bg-transparent text-black bg-white backdrop-blur-sm"
              : "bg-transparent text-white"
          }`}
      >
        <div className="w-full mx-auto">
          {/* ── Main nav ─────────────────────────────────────────── */}
          <nav
            className={`flex justify-between items-center py-4 px-4 lg:px-4 z-10 relative ${showMobileMenu || isScrolled ? "bg-white" : ""
              }`}
          >
            {/* Hamburger */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden hover:text-gray-600 transition-colors"
              aria-label="Menu"
            >
              <Menu
                className={`h-6 w-6 ${showMobileMenu || isScrolled || isLightHeaderPage
                  ? "text-black"
                  : "text-white"
                  }`}
              />
            </button>

            {/* Logo */}
            <div
              className="text-2xl font-bold text-gray-600 relative h-10 w-40 cursor-pointer"
              onClick={() => navigate("/")}
            >
              {/* White logo — shown on transparent header */}
              <img
                src={logoWhite}
                alt="cavoya-logo"
                className={`absolute inset-0 h-10 w-40 rounded-full object-cover transition-opacity duration-300 ${isScrolled || showMobileMenu || isLightHeaderPage ? "opacity-0" : "opacity-100"
                  }`}
                loading="eager"
                fetchpriority="high"
              />
              {/* Black logo — shown on white/scrolled header */}
              <img
                src={logoBlack}
                alt="cavoya-logo"
                className={`absolute inset-0 h-10 w-40 rounded-full object-cover transition-opacity duration-300 ${isScrolled || showMobileMenu || isLightHeaderPage ? "opacity-100" : "opacity-0"
                  }`}
                loading="eager"
                fetchpriority="high"
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
                      className={`w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black ${i === 0 || i === STYLES_ITEMS.length - 1
                        ? "hover:rounded-lg"
                        : ""
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shop by Collection — desktop hover dropdown (inline expand) */}
              <div className="relative group">
                <span className="hover:text-gray-500 transition-colors cursor-pointer flex items-center">
                  Shop by collection
                  <ChevronSVG />
                </span>
                <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100 py-1">
                  {collectionItems.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-gray-400">
                      No collections
                    </p>
                  ) : (
                    collectionItems.map((col) => {
                      const prints = collectionPrints[col._id] || [];
                      const isHovered = hoveredColId === col._id;
                      return (
                        <div
                          key={col._id}
                          onMouseEnter={() => {
                            setHoveredColId(col._id);
                            fetchPrintsForCollection(col._id);
                          }}
                          onMouseLeave={() => setHoveredColId(null)}
                        >
                          {/* Collection row */}
                          <button
                            onClick={() =>
                              handleNavigateWithFilters(
                                "all",
                                col._id,
                                false,
                                `/products?collectionId=${col._id}`,
                              )
                            }
                            className="w-full text-left flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black"
                          >
                            <span>{col.name}</span>
                            {prints.length > 0 && (
                              <ChevronDown
                                className={`h-3.5 w-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isHovered ? "rotate-180" : ""
                                  }`}
                              />
                            )}
                          </button>

                          {/* Prints — expand inline below on hover */}
                          {isHovered && prints.length > 0 && (
                            <div className="bg-gray-50 border-t border-b border-gray-100">
                              {prints.map((print) => (
                                <button
                                  key={print._id}
                                  onClick={() =>
                                    handleNavigateWithFilters(
                                      "all",
                                      col._id,
                                      false,
                                      `/products?collectionId=${col._id}&printId=${print._id}`,
                                    )
                                  }
                                  className="w-full text-left flex items-center gap-2.5 pl-6 pr-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
                                >
                                  {print.image && (
                                    <img
                                      src={print.image}
                                      alt={print.name}
                                      className="h-5 w-5 rounded object-cover flex-shrink-0 border border-gray-200"
                                    />
                                  )}
                                  {print.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
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
              className={`flex items-center space-x-4 ${showMobileMenu || isScrolled || isLightHeaderPage
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
            className={`lg:hidden border-t border-gray-200 transition-all duration-500 ease-in-out bg-white overflow-hidden ${showMobileMenu ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
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

              {/* Shop by Collection — mobile: outer accordion, nested accordion per collection for prints */}
              <MobileAccordion label="Shop by collection">
                {collectionItems.length === 0 ? (
                  <p className="text-sm text-gray-400">No collections</p>
                ) : (
                  collectionItems.map((col) => {
                    const prints = collectionPrints[col._id] || [];
                    return prints.length > 0 ? (
                      // Collection with prints — nested MobileAccordion
                      <MobileAccordion key={col._id} label={col.name}>
                        {prints.map((print) => (
                          <button
                            key={print._id}
                            onClick={() =>
                              handleNavigateWithFilters(
                                "all",
                                col._id,
                                false,
                                `/products?collectionId=${col._id}&printId=${print._id}`,
                                true,
                              )
                            }
                            className="flex items-center gap-2 text-left text-sm text-gray-500 hover:text-black w-full py-0.5"
                          >
                            {print.image && (
                              <img
                                src={print.image}
                                alt={print.name}
                                className="h-5 w-5 rounded object-cover flex-shrink-0 border border-gray-100"
                              />
                            )}
                            {print.name}
                          </button>
                        ))}
                      </MobileAccordion>
                    ) : (
                      // Collection without prints — plain button
                      <button
                        key={col._id}
                        onClick={() =>
                          handleNavigateWithFilters(
                            "all",
                            col._id,
                            false,
                            `/products?collectionId=${col._id}`,
                            true,
                          )
                        }
                        className="text-left text-gray-600 hover:text-black w-full"
                      >
                        {col.name}
                      </button>
                    );
                  })
                )}
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
