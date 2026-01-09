// pages/TermsPage.jsx
import React from "react";
import { FileText, AlertCircle, Shield } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 text-gray-800">
            Terms of Service
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our services. Last
            updated: January 2026
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Acceptance */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-tangerine-400 to-tangerine-600 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800">
                Acceptance of Terms
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using the Cavoya website, you accept and agree to
              be bound by these Terms of Service and our Privacy Policy. If you
              do not agree to these terms, please do not use our website or
              services.
            </p>
          </div>

          {/* Use of Website */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Use of Website
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                You agree to use this website only for lawful purposes and in a
                way that does not infringe the rights of others or restrict or
                inhibit their use of the website.
              </p>
              <p>
                <strong className="text-gray-800">
                  Prohibited activities include:
                </strong>
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Using the website for any illegal purpose</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Interfering with the proper functioning of the website</li>
                <li>Uploading malicious code or viruses</li>
                <li>Collecting user data without permission</li>
                <li>Impersonating another person or entity</li>
              </ul>
            </div>
          </div>

          {/* Products & Orders */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blush-400 to-blush-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800">
                Products and Orders
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Product Information
                </h3>
                <p>
                  We strive to display product colors and images as accurately
                  as possible. However, we cannot guarantee that your device's
                  display of colors accurately reflects the actual product
                  color. All measurements are approximate.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Pricing
                </h3>
                <p>
                  All prices are in Indian Rupees (INR) and are subject to
                  change without notice. We reserve the right to modify prices
                  at any time. However, we will honor the price displayed at the
                  time of your order.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Order Acceptance
                </h3>
                <p>
                  We reserve the right to refuse or cancel any order for any
                  reason, including but not limited to product availability,
                  errors in pricing or product information, or suspected
                  fraudulent activity.
                </p>
              </div>
            </div>
          </div>

          {/* Account Responsibilities */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Account Responsibilities
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                When you create an account with us, you are responsible for:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Providing accurate and current information</li>
              </ul>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              All content on this website, including but not limited to text,
              graphics, logos, images, and software, is the property of Cavoya
              or its content suppliers and is protected by Indian and
              international copyright laws.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You may not reproduce, distribute, modify, or create derivative
              works of any content from this website without our express written
              permission.
            </p>
          </div>

          {/* Limitation of Liability */}
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
              Cavoya shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising out of or relating to
              your use of the website or products purchased through the website.
              Our total liability shall not exceed the amount paid by you for
              the product in question.
            </p>
          </div>

          {/* Governing Law */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms of Service shall be governed by and construed in
              accordance with the laws of India. Any disputes arising from these
              terms or your use of the website shall be subject to the exclusive
              jurisdiction of the courts of Surat, Gujarat.
            </p>
          </div>

          {/* Changes to Terms */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Changes to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time.
              Changes will be effective immediately upon posting to the website.
              Your continued use of the website following any changes
              constitutes your acceptance of the new terms.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-blush-50 to-tangerine-50 p-8 rounded-2xl border border-blush-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Questions About Our Terms?
            </h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please
              contact us at{" "}
              <a
                href="mailto:legal@cavoya.com"
                className="text-tangerine-600 hover:text-tangerine-700 font-medium"
              >
                legal@cavoya.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
