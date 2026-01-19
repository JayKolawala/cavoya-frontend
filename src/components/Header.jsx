// components/Header.jsx
import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  User,
  Search,
  Heart,
  Menu,
  Truck,
  Shield,
} from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PRODUCT_CATEGORIES } from "../utils/constants";
import { getCategoryMap } from "../utils/categoryHelpers";
// import logoBlack from "../../src/assets/cavoya-black.svg";
import logoBlack from "../../src/assets/Cavoya_Logo.svg";

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

  // Get category mapping from shared utility
  const categoryMap = getCategoryMap();

  // Consolidated navigation handler to avoid duplication
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
    if (closeMobileMenu) {
      setShowMobileMenu(false);
    }
    navigate(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Change background when scrolled more than 50px (you can adjust this value)
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Add resize event listener to close mobile menu when going below 768px
  useEffect(() => {
    const handleResize = () => {
      // Close mobile menu only when screen width is below 768px (mobile breakpoint)
      if (window.innerWidth > 768) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setShowMobileMenu]);

  return (
    <>
      {/* Mobile Menu Backdrop - Only render when menu is open */}
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
          {/* Main header */}
          <nav
            className={`flex justify-between items-center py-4 px-4 lg:px-4 z-10 relative ${
              showMobileMenu || isScrolled ? "bg-white" : ""
            }`}
          >
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-6">
              <Link to="/" className="hover:text-gray-500 ">
                Home
              </Link>
              <button
                onClick={() =>
                  handleNavigateWithFilters("all", null, false, "/products")
                }
                className="hover:text-gray-500 "
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
                className="hover:text-gray-500 "
              >
                New Arrivals
              </button>

              {/* Shop by style dropdown */}
              <div className="relative group">
                <span className="hover:text-gray-500 transition-colors cursor-pointer flex items-center">
                  Shop by styles
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
                </span>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                  <button
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap["dresses"],
                        null,
                        false,
                        "/products?category=dresses",
                      )
                    }
                    className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black hover:rounded-lg"
                  >
                    Dresses
                  </button>
                  <button
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap["coord-sets"],
                        null,
                        false,
                        "/products?category=coord-sets",
                      )
                    }
                    className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black"
                  >
                    Co-ord Sets
                  </button>
                  <button
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap["tops"],
                        null,
                        false,
                        "/products?category=tops",
                      )
                    }
                    className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black"
                  >
                    Tops
                  </button>
                  <button
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap["bottomwear"],
                        null,
                        false,
                        "/products?category=bottomwear",
                      )
                    }
                    className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black"
                  >
                    Bottomwear
                  </button>
                  <button
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap["jumpsuits"],
                        null,
                        false,
                        "/products?category=jumpsuits",
                      )
                    }
                    className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:rounded-lg hover:text-black"
                  >
                    Jumpsuits
                  </button>
                </div>
              </div>

              {/* Shop by collection dropdown */}
              <div className="relative group">
                <span className="hover:text-gray-500 transition-colors cursor-pointer flex items-center">
                  Shop by collection
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
                </span>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                  <button
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap["solset"],
                        categoryMap["solset"],
                        false,
                        "/products?collection=solset",
                      )
                    }
                    className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:rounded-lg hover:text-black"
                  >
                    Solset
                  </button>
                  {/* Ocean and Floral commented out as not decided yet */}
                  {/* <button onClick={() => { setSelectedCategory("Ocean"); setSelectedCollection("Ocean"); setSelectedNewArrivals(false); navigate("/products?collection=ocean"); }} className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black">Ocean</button> */}
                  {/* <button onClick={() => { setSelectedCategory("Floral"); setSelectedCollection("Floral"); setSelectedNewArrivals(false); navigate("/products?collection=floral"); }} className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black">Floral</button> */}
                </div>
              </div>

              <Link to="/about" className="hover:text-gray-500">
                About
              </Link>
            </div>

            {/* Search Bar */}
            {/* {isProductsPage && (
              <div className="hidden lg:flex relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            )} */}

            {/* Icons */}
            <div
              className={`flex items-center space-x-4  ${
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
              {/* <button
                onClick={() => navigate("/login")}
                className="hover:text-gray-500 transition-colors"
                aria-label="Login"
              >
                <User className="h-6 w-6" />
              </button> */}
            </div>
          </nav>

          {/* Mobile Menu */}
          <div
            className={` lg:hidden border-t border-gray-200 transition-all duration-500 ease-in-out bg-white overflow-hidden ${
              showMobileMenu ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col space-y-4 p-4">
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

              {/* Shop by style - Mobile */}
              <div className="flex flex-col space-y-2">
                <div className="text-left text-black font-medium">
                  Shop by style
                </div>
                <div className="flex flex-col space-y-2 pl-4">
                  <button
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap["dresses"],
                        null,
                        false,
                        "/products?category=dresses",
                        true,
                      )
                    }
                    className="text-left text-gray-600 hover:text-black"
                  >
                    Dresses
                  </button>
                  <button
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap["coord-sets"],
                        null,
                        false,
                        "/products?category=coord-sets",
                        true,
                      )
                    }
                    className="text-left text-gray-600 hover:text-black"
                  >
                    Co-ord Sets
                  </button>
                  <button
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap["tops"],
                        null,
                        false,
                        "/products?category=tops",
                        true,
                      )
                    }
                    className="text-left text-gray-600 hover:text-black"
                  >
                    Tops
                  </button>
                  <button
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap["bottomwear"],
                        null,
                        false,
                        "/products?category=bottomwear",
                        true,
                      )
                    }
                    className="text-left text-gray-600 hover:text-black"
                  >
                    Bottomwear
                  </button>
                  <button
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap["jumpsuits"],
                        null,
                        false,
                        "/products?category=jumpsuits",
                        true,
                      )
                    }
                    className="text-left text-gray-600 hover:text-black"
                  >
                    Jumpsuits
                  </button>
                </div>
              </div>

              {/* Shop by collecting - Mobile */}
              <div className="flex flex-col space-y-2">
                <div className="text-left text-black font-medium">
                  Shop by collection
                </div>
                <div className="flex flex-col space-y-2 pl-4">
                  <button
                    onClick={() =>
                      handleNavigateWithFilters(
                        categoryMap["solset"],
                        categoryMap["solset"],
                        false,
                        "/products?collection=solset",
                        true,
                      )
                    }
                    className="text-left text-gray-600 hover:text-black"
                  >
                    Solset
                  </button>
                  {/* Ocean and Floral commented out as not decided yet */}
                  {/* <Link to="/products?collection=ocean" className="text-gray-600 hover:text-black" onClick={() => setShowMobileMenu(false)}>Ocean</Link> */}
                  {/* <Link to="/products?collection=floral" className="text-gray-600 hover:text-black" onClick={() => setShowMobileMenu(false)}>Floral</Link> */}
                </div>
              </div>

              <Link
                to="/about"
                className="text-left text-black hover:text-gray-500"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
