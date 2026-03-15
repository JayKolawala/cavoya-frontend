// pages/PrivacyPolicyPage.jsx
import React from "react";
import { Shield, Eye, Lock, UserCheck } from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 text-gray-800">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how Cavoya
            collects, uses, and protects your personal information.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">

          {/* Introduction */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <p className="text-gray-600 leading-relaxed">
              At Cavoya, we respect your privacy and are committed to protecting
              your personal information. This Privacy Policy explains how we
              collect, use, and safeguard your information when you visit our
              website or purchase our products.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              By using our website, you agree to the practices described in this
              Privacy Policy.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-tangerine-400 to-tangerine-600 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>

              <h2 className="text-3xl font-light text-gray-800">
                What Information Do We Collect?
              </h2>
            </div>

            <div className="space-y-4 text-gray-600">
              <p>
                When you visit or make a purchase from our website, we may
                collect certain personal information including:
              </p>

              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Billing and shipping address</li>
                <li>Payment details required to process your order</li>
              </ul>

              <p className="mt-4">
                We may also collect technical information such as your IP
                address, browser type, device information, and browsing activity
                to improve the functionality and performance of our website.
              </p>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blush-400 to-blush-600 rounded-xl flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>

              <h2 className="text-3xl font-light text-gray-800">
                How Do We Use Your Information?
              </h2>
            </div>

            <div className="space-y-3 text-gray-600">
              <p>The information we collect may be used to:</p>

              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Process and deliver your orders</li>
                <li>Communicate with you regarding purchases</li>
                <li>Provide customer support</li>
                <li>Improve our website and services</li>
                <li>Enhance overall customer experience</li>
              </ul>

              <p className="mt-4">
                With your consent, we may also send updates, promotional offers,
                and information about new collections or products from Cavoya.
              </p>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-matcha-400 to-matcha-600 rounded-xl flex items-center justify-center">
                <Lock className="h-6 w-6 text-white" />
              </div>

              <h2 className="text-3xl font-light text-gray-800">
                How Do We Protect Your Information?
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed">
              We take appropriate security measures to protect your personal
              information from unauthorized access, alteration, disclosure, or
              misuse.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              All sensitive payment information is processed through secure
              third-party payment gateways. Cavoya does not store your complete
              card or payment details on our servers.
            </p>
          </div>

          {/* Third Party Sharing */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-sea-400 to-sea-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>

              <h2 className="text-3xl font-light text-gray-800">
                Do We Share Information with Third Parties?
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Cavoya does not sell, trade, or rent your personal information to
              third parties.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              However, we may share necessary information with trusted service
              providers such as payment processors, shipping and logistics
              partners, and website service providers in order to operate our
              business and fulfill customer orders.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              These partners are required to keep your information secure and
              confidential.
            </p>
          </div>

          {/* Third Party Links */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Third-Party Links
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Our website may contain links to third-party websites such as
              social media platforms or external services. Cavoya is not
              responsible for the privacy practices or content of these
              websites.
            </p>
          </div>

          {/* Policy Changes */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Changes to This Privacy Policy
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Cavoya may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              Any updates will be posted on this page with the revised effective
              date.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-blush-50 to-tangerine-50 p-8 rounded-2xl border border-blush-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Contact Us
            </h2>

            <p className="text-gray-700">
              If you have any questions regarding this Privacy Policy, please
              contact us at:
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

export default PrivacyPolicyPage;