// pages/ReturnsPage.jsx
import React from "react";
import { RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const ReturnsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 text-gray-800">
            Returns & Exchanges
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your satisfaction is our priority. Easy 30-day returns.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Return Policy */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-tangerine-400 to-tangerine-600 rounded-xl flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800">
                30-Day Return Policy
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                We want you to be completely satisfied with your purchase. If
                for any reason you're not happy with your order, you can return
                it within 30 days of delivery for a full refund or exchange.
              </p>
              <p>
                All items must be returned in their original condition, unworn,
                unwashed, and with all tags attached.
              </p>
            </div>
          </div>

          {/* How to Return */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              How to Return an Item
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blush-100 rounded-full flex items-center justify-center text-blush-600 font-semibold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Initiate Return Request
                  </h3>
                  <p className="text-gray-600">
                    Log into your account and go to "My Orders". Select the item
                    you wish to return and click "Return Item".
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blush-100 rounded-full flex items-center justify-center text-blush-600 font-semibold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Pack the Item
                  </h3>
                  <p className="text-gray-600">
                    Pack the item securely in its original packaging. Include
                    all tags, labels, and accessories.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blush-100 rounded-full flex items-center justify-center text-blush-600 font-semibold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Schedule Pickup
                  </h3>
                  <p className="text-gray-600">
                    Our courier partner will pick up the item from your address
                    within 2-3 business days.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blush-100 rounded-full flex items-center justify-center text-blush-600 font-semibold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Get Your Refund
                  </h3>
                  <p className="text-gray-600">
                    Once we receive and inspect your return, your refund will be
                    processed within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Eligible vs Non-Eligible */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-6 w-6 text-matcha-500" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Eligible for Return
                </h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-matcha-500 mt-1">✓</span>
                  <span>Items with original tags attached</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-matcha-500 mt-1">✓</span>
                  <span>Unworn and unwashed products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-matcha-500 mt-1">✓</span>
                  <span>Items in original packaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-matcha-500 mt-1">✓</span>
                  <span>Returned within 30 days</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-6 w-6 text-red-500" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Not Eligible for Return
                </h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Items without tags</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Worn, used, or washed items</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Damaged or altered products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Sale or clearance items</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Exchange Policy */}
          <div className="bg-gradient-to-br from-blush-50 to-tangerine-50 p-8 rounded-2xl border border-blush-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-tangerine-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Exchange Policy
              </h2>
            </div>
            <p className="text-gray-700 mb-4">
              We're happy to exchange your item for a different size or color,
              subject to availability. Simply select "Exchange" when initiating
              your return request.
            </p>
            <p className="text-gray-700">
              For any questions about returns or exchanges, please contact us at{" "}
              <a
                href="mailto:support@cavoya.com"
                className="text-tangerine-600 hover:text-tangerine-700 font-medium"
              >
                support@cavoya.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
