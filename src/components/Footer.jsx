import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/cavoya.svg";

/**
 * Footer — uses semantic <a href> / <Link> tags (not button onClick) so
 * Google can crawl all internal links and build PageRank signals.
 */
const Footer = () => {
  return (
    <footer className="bg-black text-white" aria-label="Site footer">
      <div className="container mx-auto px-4 pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <Link to="/" aria-label="Cavoya Home">
              <img src={logo} alt="Cavoya - Premium Women's Fashion Brand" className="h-24 w-fit" />
            </Link>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Premium women's fashion brand in India.<br />
              Crafted in Surat, Gujarat.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-3">
              <a
                href="https://www.instagram.com/cavoya.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cavoya on Instagram"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://wa.me/917383096696"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact Cavoya on WhatsApp"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.85L.057 23.571a.5.5 0 00.372.614l5.938-1.556A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.866 9.866 0 01-5.031-1.375l-.36-.214-3.733.979.995-3.638-.235-.374A9.865 9.865 0 012.118 12C2.118 6.553 6.553 2.118 12 2.118c5.446 0 9.882 4.435 9.882 9.882 0 5.446-4.436 9.882-9.882 9.882z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <nav aria-label="Shop navigation">
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/products?newArrivals=true" className="hover:text-white transition-colors text-sm">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products?category=dresses" className="hover:text-white transition-colors text-sm">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/products?category=coord-sets" className="hover:text-white transition-colors text-sm">
                  Co-ord Sets
                </Link>
              </li>
              <li>
                <Link to="/products?category=ethnic-wear" className="hover:text-white transition-colors text-sm">
                  Ethnic Wear
                </Link>
              </li>
              <li>
                <Link to="/products?category=western-wear" className="hover:text-white transition-colors text-sm">
                  Western Wear
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors text-sm">
                  All Products
                </Link>
              </li>
            </ul>
          </nav>

          {/* Customer Care */}
          <nav aria-label="Customer care navigation">
            <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors text-sm">
                  Refund &amp; Return Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-white transition-colors text-sm">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company navigation">
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors text-sm">
                  About Cavoya
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@cavoya.in"
                  className="hover:text-white transition-colors text-sm"
                >
                  support@cavoya.in
                </a>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="text-gray-600 hover:text-gray-400 transition-colors text-xs"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Cavoya. All rights reserved. Premium Women&apos;s Fashion Brand in India.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy-policy"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>

        <div className="text-center mt-4 pt-4 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            Developed by{" "}
            <a
              href="https://jaykolawala.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors font-medium"
            >
              Jay Kolawala
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
