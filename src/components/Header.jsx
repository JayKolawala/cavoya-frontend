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
// import logoBlack from "../../src/assets/cavoya-black.svg";
import logoBlack from "../../src/assets/Cavoya_Logo.svg";

const Header = () => {
  const {
    getCartItemsCount,
    searchQuery,
    setSearchQuery,
    showMobileMenu,
    setShowMobileMenu,
  } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const isProductsPage = location.pathname === "/products";
  const isHomePage = location.pathname === "/";

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
          className="max-md:bg-black/50 min-h-screen fixed top-0 left-0 w-full transition duration-300 ease-linear z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <header
        className={`transition duration-300 ease-linear fixed top-0 z-50 w-full ${
          isScrolled || !isHomePage
            ? "bg-white shadow-lg shadow-black/20"
            : "bg-transparent text-white"
        }`}
      >
        <div className="w-full mx-auto">
          {/* Main header */}
          <nav
            className={`flex justify-between items-center py-4 px-4 md:px-4 z-10 relative ${
              showMobileMenu || isScrolled ? "bg-white" : ""
            }`}
          >
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden hover:text-tangerine-500 transition-colors"
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
            <div className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="hover:text-tangerine-500 transition-colors"
              >
                New Arrivals
              </Link>
              <Link
                to="/products"
                className="hover:text-tangerine-500 transition-colors"
              >
                Shop All
              </Link>
              <Link
                to="/products"
                className="hover:text-tangerine-500 transition-colors"
              >
                Sale
              </Link>
              <Link
                to="/about"
                className="hover:text-tangerine-500 transition-colors"
              >
                About
              </Link>
            </div>

            {/* Search Bar */}
            {isProductsPage && (
              <div className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blush-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            )}

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
                className="hover:text-tangerine-500 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="h-6 w-6" />
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="hover:text-tangerine-500 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-tangerine-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
              {/* <button
                onClick={() => navigate("/login")}
                className="hover:text-tangerine-500 transition-colors"
                aria-label="Login"
              >
                <User className="h-6 w-6" />
              </button> */}
            </div>
          </nav>

          {/* Mobile Menu */}
          <div
            className={` md:hidden border-t transition-all duration-500 ease-in-out bg-white overflow-hidden ${
              showMobileMenu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col space-y-4 p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blush-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Link
                to="/"
                className="text-left text-black hover:text-tangerine-500"
                onClick={() => setShowMobileMenu(false)}
              >
                New Arrivals
              </Link>
              <Link
                to="/products"
                className="text-left text-black hover:text-tangerine-500"
                onClick={() => setShowMobileMenu(false)}
              >
                Shop All
              </Link>
              <Link
                to="/products"
                className="text-left text-black hover:text-tangerine-500"
                onClick={() => setShowMobileMenu(false)}
              >
                Sale
              </Link>
              <Link
                to="/about"
                className="text-left text-black hover:text-tangerine-500"
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
