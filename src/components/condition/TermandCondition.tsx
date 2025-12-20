// File: src/app/terms-conditions/page.tsx
"use client";

import React from "react";

const TermandCondition: React.FC = () => {
  return (
    <div className="w-full px-4 py-12 flex justify-center">
      <div className="w-full max-w-[1300px] mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Terms & Conditions
        </h1>
        <p className="mb-6 text-gray-700">Last Updated: 07 December 2025</p>
        <p className="mb-6 text-gray-700">
          By accessing or using Pri Priya Nursery, you agree to the following terms:
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Nature of Business</h2>
          <p className="text-gray-700">
            Pri Priya Nursery is a nursery wholesaler, manufacturer & supplier dealing in live plants. Product availability may vary due to seasonal and climatic conditions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Orders</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Orders are confirmed only after successful payment.</li>
            <li>Bulk / wholesale orders may require additional confirmation.</li>
            <li>Images shown are for reference; actual plant size & appearance may vary.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Pricing</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>All prices are listed in INR.</li>
            <li>Prices may change without prior notice.</li>
            <li>Shipping charges (if applicable) are shown at checkout.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. User Responsibility</h2>
          <p className="text-gray-700">
            Customers must provide correct address and contact details. We are not responsible for delivery failure due to incorrect information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <p className="text-gray-700">
            All content on this website (text, images, logos) is the property of Pri Priya Nursery and may not be used without permission.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">6. Governing Law</h2>
          <p className="text-gray-700">
            These terms are governed by the laws of India, with jurisdiction in Nadia, West Bengal.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermandCondition;
