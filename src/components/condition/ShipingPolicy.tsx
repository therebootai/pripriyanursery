// File: src/app/shipping-policy/page.tsx
"use client";

import React from "react";

const ShipingPolicy: React.FC = () => {
  return (
    <div className="w-full px-4 py-12 flex justify-center">
      <div className="w-full max-w-[1300px] mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Shipping Policy
        </h1>
        <p className="mb-6 text-gray-700">Last Updated: 07 December 2025</p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Shipping Locations</h2>
          <p className="text-gray-700">
            We ship across India, with special focus on North East India, Sikkim, Assam, Siliguri, and nearby regions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Shipping Time</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Order processing time: 2–5 working days</li>
            <li>Delivery time: 5–10 working days, depending on location</li>
            <li>Delivery timelines may vary due to weather, plant safety, or logistics issues</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Shipping Method</h2>
          <p className="text-gray-700">
            Plants are carefully packed to ensure safety during transit. However, minor leaf damage may occur due to transportation.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. Shipping Charges</h2>
          <p className="text-gray-700">
            Shipping charges (if applicable) are calculated at checkout or informed separately for bulk orders.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">5. Delivery Responsibility</h2>
          <p className="text-gray-700">
            Once the order is handed over to the courier/logistics partner, delivery timelines depend on the carrier.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShipingPolicy;
