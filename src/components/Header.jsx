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
import logo from "../../src/assets/cavoya.svg";
import logoBlack from "../../src/assets/cavoya-black.svg";

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
  console.log(isScrolled);

  const isProductsPage = location.pathname === "/products";

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

  return (
    <header
      className={`transition duration-300 ease-in-out  fixed top-0 z-50 w-full ${
        isScrolled ? "bg-white" : "bg-transparent text-white"
      }`}
    >
      <div
        className={`transition duration-300 ease-in-out ${
          showMobileMenu ? "bg-white" : ""
        }`}
      >
        <div className="container mx-auto px-2 md:px-4">
          {/* Main header */}
          <nav className="flex justify-between items-center py-4">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden hover:text-pink-400 transition-colors"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div
              className="text-2xl font-bold text-gray-600"
              onClick={() => navigate("/")}
            >
              <img
                src={` ${isScrolled ? logoBlack : logo}`}
                alt="cavoya-logo"
                className="h-10 w-40 rounded-full object-cover cursor-pointer"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="hover:text-pink-400 transition-colors">
                New Arrivals
              </Link>
              <Link
                to="/products"
                className="hover:text-pink-400 transition-colors"
              >
                Shop All
              </Link>
              <Link
                to="/products"
                className="hover:text-pink-400 transition-colors"
              >
                Sale
              </Link>
              <Link
                to="/about"
                className="hover:text-pink-400 transition-colors"
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
                  className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            )}

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/wishlist")}
                className="hover:text-pink-400 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="h-6 w-6" />
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="hover:text-pink-400 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate("/admin/login")}
                className="hover:text-pink-400 transition-colors"
                aria-label="Login"
              >
                <User className="h-6 w-6" />
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Link
                  to="/"
                  className="text-left hover:text-pink-400"
                  onClick={() => setShowMobileMenu(false)}
                >
                  New Arrivals
                </Link>
                <Link
                  to="/products"
                  className="text-left hover:text-pink-400"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Shop All
                </Link>
                <Link
                  to="/products"
                  className="text-left hover:text-pink-400"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sale
                </Link>
                <Link
                  to="/about"
                  className="text-left hover:text-pink-400"
                  onClick={() => setShowMobileMenu(false)}
                >
                  About
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
