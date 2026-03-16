// pages/TermsPage.jsx
import React from "react";
import { FileText, AlertCircle, Shield } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-24">
      <div className="container mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 text-white">
            Terms & Conditions
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using Cavoya or placing an
            order through our website.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">

          {/* Introduction */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-tangerine-400 to-tangerine-600 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800">
                Introduction
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Welcome to Cavoya. These Terms and Conditions govern your access
              to and use of our website and the purchase of products offered
              through our platform. By accessing, browsing, or using this
              website, you agree to comply with and be bound by these Terms and
              Conditions. If you do not agree with any part of these terms,
              please do not use this website.
            </p>
          </div>

          {/* Use of Website */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Use of the Website
            </h2>

            <div className="space-y-4 text-gray-600">
              <p>
                By using this website, you confirm that all information you
                provide is accurate, current, and complete.
              </p>

              <p>
                You agree to use this website only for lawful purposes and in a
                manner that does not violate any applicable laws or regulations.
              </p>

              <p className="font-medium text-gray-800">
                You must not misuse this website by:
              </p>

              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Introducing malicious software or viruses</li>
                <li>Attempting unauthorized access to our systems</li>
                <li>Interfering with the website’s functionality</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blush-400 to-blush-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>

              <h2 className="text-3xl font-light text-gray-800">
                Products & Product Information
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Cavoya offers printed western garments through its online store.
              We make every effort to display product colors, prints, and
              details as accurately as possible. However, actual colors may vary
              slightly depending on device screens, lighting conditions, or
              photography.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              Product descriptions, images, and pricing may change at any time
              without prior notice.
            </p>
          </div>

          {/* Pricing */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Pricing
            </h2>

            <p className="text-gray-600 leading-relaxed">
              All prices listed on our website are in Indian Rupees (INR). Prices
              may be inclusive or exclusive of applicable taxes depending on the
              product page.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              Cavoya reserves the right to modify product prices at any time
              without prior notice. In the event of a pricing error or incorrect
              product information, we reserve the right to cancel or refuse any
              order placed for that product.
            </p>
          </div>

          {/* Orders */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Orders
            </h2>

            <p className="text-gray-600 leading-relaxed">
              When placing an order on our website, you agree that the
              information provided during checkout is accurate and complete.
              All orders are subject to acceptance and product availability.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              Cavoya reserves the right to cancel or refuse any order due to
              suspected fraud, pricing errors, product unavailability, or
              technical issues.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              An order confirmation email only confirms that your request has
              been received and does not guarantee order acceptance.
            </p>
          </div>

          {/* Payments */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Payments
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Payments can be made using available payment methods such as
              credit cards, debit cards, UPI, net banking, or other digital
              payment options.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              All payment transactions are securely processed through trusted
              third-party payment gateways. Cavoya does not store your complete
              card details.
            </p>
          </div>

          {/* Shipping */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Shipping & Delivery
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Orders are processed and shipped within the timeframe mentioned in
              our Shipping Policy. Delivery times may vary depending on your
              location and courier services.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              Cavoya is not responsible for delays caused by courier companies,
              natural events, or circumstances beyond our control.
            </p>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Intellectual Property
            </h2>

            <p className="text-gray-600 leading-relaxed">
              All content on this website including images, graphics, logos,
              text, designs, and layout is the intellectual property of Cavoya
              and is protected under applicable copyright and intellectual
              property laws.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              You may not reproduce, copy, distribute, or modify any content
              without written permission from Cavoya.
            </p>
          </div>

          {/* Liability */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-matcha-400 to-matcha-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>

              <h2 className="text-3xl font-light text-gray-800">
                Limitation of Liability
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Cavoya shall not be liable for any direct, indirect, incidental,
              or consequential damages resulting from the use of this website or
              the purchase of our products.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              While we aim to keep information accurate and updated, we do not
              guarantee that the website will always be free from errors or
              interruptions.
            </p>
          </div>

          {/* Governing Law */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Governing Law
            </h2>

            <p className="text-gray-600 leading-relaxed">
              These Terms and Conditions shall be governed by the laws of India.
              Any disputes related to the use of this website or purchase of
              products shall fall under the jurisdiction of the appropriate
              courts in India.
            </p>
          </div>

          {/* Changes */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Changes to Terms
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Cavoya reserves the right to update or modify these Terms and
              Conditions at any time. Updates will be posted on this page and
              continued use of the website constitutes acceptance of the
              revised terms.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-blush-50 to-tangerine-50 p-8 rounded-2xl border border-blush-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Contact Us
            </h2>

            <p className="text-gray-700">
              If you have questions regarding these Terms and Conditions,
              please contact us at:
            </p>

            <div className="mt-4 space-y-2 text-gray-800">
              <p>
                <strong>Email:</strong> support@cavoya.in
              </p>

              <p>
                <strong>WhatsApp:</strong> +91 7383096696
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsPage;