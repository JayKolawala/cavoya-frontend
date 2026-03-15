// pages/ReturnsPage.jsx
import React from "react";
import { RotateCcw, CheckCircle, XCircle, AlertCircle, Truck } from "lucide-react";

const ReturnsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 text-gray-800">
            Refund & Return Policy
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            At Cavoya, we strive to provide high-quality garments and a smooth
            shopping experience for every customer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">

          {/* Intro */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <p className="text-gray-600 leading-relaxed">
              All products are carefully checked before dispatch. However,
              if you receive a damaged or incorrect product, we will assist you
              with a return or refund according to the policy outlined below.
            </p>
          </div>

          {/* Eligibility */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-tangerine-400 to-tangerine-600 rounded-xl flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>

              <h2 className="text-3xl font-light text-gray-800">
                Eligibility for Returns
              </h2>
            </div>

            <p className="text-gray-600 mb-4">
              Returns are accepted only in the following situations:
            </p>

            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>The product received is damaged or defective</li>
              <li>The wrong product has been delivered</li>
            </ul>

            <p className="text-gray-600 mt-4">
              All return requests must be raised within <strong>7 days</strong> of receiving the order.
            </p>

            <p className="text-gray-600 mt-4">
              To claim a return for a damaged or incorrect product, an
              <strong> unboxing video is mandatory</strong>. The video must show
              the unopened package being opened and the condition of the
              product.
            </p>

            <p className="text-gray-600 mt-4">
              The product must be unused, unwashed, with original tags and
              packaging intact.
            </p>
          </div>

          {/* Non Returnable */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="h-6 w-6 text-red-500" />
              <h2 className="text-3xl font-light text-gray-800">
                Non-Returnable Situations
              </h2>
            </div>

            <ul className="space-y-3 text-gray-600 list-disc list-inside">
              <li>Incorrect size selected by the customer</li>
              <li>Minor color differences due to screen or lighting</li>
              <li>Change of mind after purchase</li>
              <li>Products worn, washed, or altered</li>
              <li>Products purchased during sales or promotions</li>
            </ul>

            <p className="text-gray-600 mt-4">
              Customers are advised to carefully review product descriptions,
              images, and size details before placing an order.
            </p>
          </div>

          {/* Return Process */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Return Request Process
            </h2>

            <p className="text-gray-600 mb-4">
              If you receive a damaged or incorrect product, contact our support
              team and provide the following details:
            </p>

            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Order number</li>
              <li>Description of the issue</li>
              <li>Clear photos of the product</li>
              <li>Unboxing video of the package</li>
            </ul>

            <p className="text-gray-600 mt-4">
              Our team will review the request and confirm whether the return
              request has been approved.
            </p>
          </div>

          {/* Inspection */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-matcha-500" />
              <h2 className="text-3xl font-light text-gray-800">
                Inspection & Approval
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Once the returned product is received, it will be inspected by our
              team to ensure it meets the return conditions mentioned in this
              policy. Cavoya reserves the right to approve or reject a return
              request if the product does not meet these requirements.
            </p>
          </div>

          {/* Refund */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Refund Process
            </h2>

            <p className="text-gray-600">
              After the returned item has been inspected and approved, the
              refund will be processed to the original payment method used
              during purchase.
            </p>

            <p className="text-gray-600 mt-4">
              Refunds are generally processed within
              <strong> 10-12 business days</strong>.
            </p>

            <p className="text-gray-600 mt-4">
              Courier charges for returning the product may be deducted from the
              refund amount depending on the situation.
            </p>
          </div>

          {/* Cancellation */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-tangerine-600" />
              <h2 className="text-3xl font-light text-gray-800">
                Order Cancellation
              </h2>
            </div>

            <p className="text-gray-600">
              Orders can only be cancelled before they are shipped. Once an
              order has been dispatched, cancellation will not be possible.
            </p>
          </div>

          {/* Shipping Policy */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="h-6 w-6 text-blue-500" />
              <h2 className="text-3xl font-light text-gray-800">
                Shipping Policy
              </h2>
            </div>

            <div className="space-y-4 text-gray-600">

              <p>
                Once an order is placed and payment is confirmed, the order
                enters our processing stage where garments are prepared and
                quality checked.
              </p>

              <p>
                Orders are processed only on business days and not on Sundays or
                public holidays.
              </p>

              <p>
                The estimated delivery time is approximately
                <strong> 12–15 business days</strong> from order confirmation.
              </p>

              <p>
                Delivery timelines may vary depending on location, courier
                service availability, weather conditions, or public holidays.
              </p>

              <p>
                Once the order is shipped, customers will receive a tracking
                number to monitor their shipment.
              </p>

              <p>
                Customers must provide accurate delivery information. Cavoya is
                not responsible for delays caused by incorrect addresses.
              </p>

              <p>
                If a package appears lost or arrives damaged, customers should
                contact our support team immediately with their order details.
              </p>

            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-blush-50 to-tangerine-50 p-8 rounded-2xl border border-blush-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Contact Us
            </h2>

            <p className="text-gray-700">
              If you have any questions regarding returns, refunds, or shipping,
              please contact us:
            </p>

            <div className="mt-4 space-y-2 text-gray-800">
              <p>
                <strong>Email:</strong> support@cavoya.in
              </p>
              <p>
                <strong>WhatsApp:</strong> Cavoya
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;