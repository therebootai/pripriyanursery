// File: src/app/privacy-policy/page.tsx
"use client";

import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full px-4 py-12 flex justify-center">
      <div className="w-full max-w-[1300px] mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Privacy Policy
        </h1>
        <p className="mb-6 text-gray-700">
          Welcome to Pri Priya Nursery. Your privacy is important to us. This
          Privacy Policy explains how we collect, use, and protect your personal
          information when you visit or make a purchase from{" "}
          <a
            href="https://www.pripriyanursery.com"
            className="text-blue-600 hover:underline"
          >
            https://www.pripriyanursery.com
          </a>
          .
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Name, mobile number, email address</li>
            <li>Billing & shipping address</li>
            <li>Order details and purchase history</li>
            <li>
              Payment details (processed securely via Razorpay – we do not store
              card details)
            </li>
            <li>IP address, browser type, device information (for security & analytics)</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Process and deliver orders</li>
            <li>Communicate order updates</li>
            <li>Provide customer support</li>
            <li>Improve our website and services</li>
            <li>Comply with legal requirements</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Payment Security</h2>
          <p className="text-gray-700">
            All payments are processed through Razorpay, a secure and PCI-DSS
            compliant payment gateway. We do not store your card, UPI, or net
            banking details.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. Data Protection</h2>
          <p className="text-gray-700">
            We take reasonable security measures to protect your personal
            information against unauthorized access, misuse, or disclosure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
          <p className="text-gray-700">
            We may share limited data with:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
            <li>Payment gateway (Razorpay)</li>
            <li>Delivery partners</li>
            <li>Government authorities if legally required</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p className="text-gray-700">
            You may request access, correction, or deletion of your personal data by contacting us:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
            <li>📧 Email: <a href="mailto:pripriyanursery@gmail.com" className="text-blue-600 hover:underline">pripriyanursery@gmail.com</a></li>
            <li>📞 Phone: +91 9679164875</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
