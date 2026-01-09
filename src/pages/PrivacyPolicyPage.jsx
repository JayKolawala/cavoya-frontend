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
            Your privacy is important to us. Last updated: January 2026
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <p className="text-gray-600 leading-relaxed">
              At Cavoya, we are committed to protecting your personal
              information and your right to privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you visit our website or use our services.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-tangerine-400 to-tangerine-600 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800">
                Information We Collect
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Personal Information
                </h3>
                <p>
                  We collect personal information that you voluntarily provide
                  to us when you register on the website, place an order,
                  subscribe to our newsletter, or contact us. This may include:
                </p>
                <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                  <li>Name and contact information</li>
                  <li>Email address and phone number</li>
                  <li>Billing and shipping address</li>
                  <li>Payment information (processed securely)</li>
                  <li>Account credentials</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Automatic Information
                </h3>
                <p>
                  We automatically collect certain information when you visit
                  our website, including:
                </p>
                <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                  <li>IP address and browser type</li>
                  <li>Device information</li>
                  <li>Pages visited and time spent</li>
                  <li>Referring websites</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blush-400 to-blush-600 rounded-xl flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800">
                How We Use Your Information
              </h2>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>
                  Send you promotional materials and updates (with consent)
                </li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
                <li>Analyze usage patterns and trends</li>
              </ul>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-matcha-400 to-matcha-600 rounded-xl flex items-center justify-center">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800">
                Data Security
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, please
              note that no method of transmission over the Internet or
              electronic storage is 100% secure.
            </p>
          </div>

          {/* Cookies */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-sea-400 to-sea-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800">
                Cookies and Tracking
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                We use cookies and similar tracking technologies to enhance your
                browsing experience and analyze website traffic. You can control
                cookies through your browser settings.
              </p>
              <p>
                <strong className="text-gray-800">
                  Types of cookies we use:
                </strong>
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Essential cookies (required for website functionality)</li>
                <li>Analytics cookies (to understand website usage)</li>
                <li>Marketing cookies (for personalized advertising)</li>
              </ul>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-light text-gray-800 mb-6">
              Your Privacy Rights
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your information</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Request data portability</li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-blush-50 to-tangerine-50 p-8 rounded-2xl border border-blush-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-gray-700">
              If you have any questions or concerns about our privacy practices,
              please contact us at{" "}
              <a
                href="mailto:privacy@cavoya.com"
                className="text-tangerine-600 hover:text-tangerine-700 font-medium"
              >
                privacy@cavoya.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
