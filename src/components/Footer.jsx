import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Cavoya</h3>
            <p className="text-gray-400 mb-4">Elegance in every stitch</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => navigate("/products")}
                  className="hover:text-white transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/products")}
                  className="hover:text-white transition-colors"
                >
                  Dresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/products")}
                  className="hover:text-white transition-colors"
                >
                  Sale
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/shipping")}
                  className="hover:text-white transition-colors"
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/returns")}
                  className="hover:text-white transition-colors"
                >
                  Returns
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => navigate("/about")}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/admin/login")}
                  className="hover:text-white transition-colors text-sm opacity-70"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className=" mt-8 pt-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Cavoya. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button
              onClick={() => navigate("/privacy")}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms")}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </button>
          </div>
        </div>
        <div className="text-center mt-4 pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
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
