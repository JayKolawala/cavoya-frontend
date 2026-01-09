// pages/ShippingPage.jsx
import React from "react";
import { Truck, Clock, MapPin, Package } from "lucide-react";

const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 text-gray-800">
            Shipping Information
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Fast, reliable delivery to your doorstep
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Shipping Methods */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-tangerine-400 to-tangerine-600 rounded-xl flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800">
                Shipping Methods
              </h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-tangerine-500 pl-6 py-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Standard Shipping (Free)
                </h3>
                <p className="text-gray-600">
                  Free shipping on all orders over ₹999. Delivery within 5-7
                  business days.
                </p>
              </div>
              <div className="border-l-4 border-blush-500 pl-6 py-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Express Shipping (₹150)
                </h3>
                <p className="text-gray-600">
                  Fast delivery within 2-3 business days. Available for all
                  locations.
                </p>
              </div>
              <div className="border-l-4 border-matcha-500 pl-6 py-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Same-Day Delivery (₹300)
                </h3>
                <p className="text-gray-600">
                  Available in select metro cities. Order before 12 PM for
                  same-day delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Timeline */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blush-400 to-blush-600 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800">
                Delivery Timeline
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong className="text-gray-800">Processing Time:</strong> All
                orders are processed within 1-2 business days. Orders placed on
                weekends or holidays will be processed the next business day.
              </p>
              <p>
                <strong className="text-gray-800">Shipping Time:</strong> Once
                your order has been shipped, you will receive a confirmation
                email with tracking information.
              </p>
              <p>
                <strong className="text-gray-800">
                  Estimated Delivery Times:
                </strong>
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Metro Cities: 2-4 business days</li>
                <li>Tier 2 Cities: 3-5 business days</li>
                <li>Other Locations: 5-7 business days</li>
              </ul>
            </div>
          </div>

          {/* Shipping Locations */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-matcha-400 to-matcha-600 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800">
                Shipping Locations
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              We currently ship to all addresses within India. International
              shipping is not available at this time.
            </p>
            <p className="text-gray-600">
              We ship to PO Boxes, APO/FPO addresses, and all Indian states and
              union territories.
            </p>
          </div>

          {/* Order Tracking */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-sea-400 to-sea-600 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800">
                Track Your Order
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                Once your order ships, you'll receive a tracking number via
                email. You can use this number to track your package on our
                courier partner's website.
              </p>
              <p>
                If you have any questions about your shipment, please contact
                our customer service team at{" "}
                <a
                  href="mailto:support@cavoya.com"
                  className="text-tangerine-500 hover:text-tangerine-600 font-medium"
                >
                  support@cavoya.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
