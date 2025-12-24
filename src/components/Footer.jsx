import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Cavoya</h3>
            <p className="text-gray-300 mb-4">Elegance in every stitch</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button
                  onClick={() => navigate("/products")}
                  className="hover:text-tangerine-400 transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/products")}
                  className="hover:text-tangerine-400 transition-colors"
                >
                  Dresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/products")}
                  className="hover:text-tangerine-400 transition-colors"
                >
                  Sale
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-tangerine-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-tangerine-400 transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-tangerine-400 transition-colors">
                  Returns
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button
                  onClick={() => navigate("/about")}
                  className="hover:text-tangerine-400 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-tangerine-400 transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className=" mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            &copy; 2024 Cavoya. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-300 hover:text-tangerine-400 transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-tangerine-400 transition-colors text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
        <div className="text-center mt-4 pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            Developed by{" "}
            <a
              href="https://jaykolawala.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tangerine-400 hover:text-tangerine-300 transition-colors font-medium"
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
