// File: src/app/refund-policy/page.tsx
"use client";

import React from "react";

const RefundPolicy: React.FC = () => {
  return (
    <div className="w-full px-4 py-12 flex justify-center">
      <div className="w-full max-w-[1300px] mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Refund & Cancellation Policy
        </h1>
        <p className="mb-6 text-gray-700">Last Updated: 07 December 2025</p>
        <p className="mb-6 text-gray-700">
          ⚠️ Due to the nature of live plants, our refund policy is limited.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Order Cancellation</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Orders can be cancelled within 24 hours of placing the order.</li>
            <li>Once dispatched, orders cannot be cancelled.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Refund Eligibility</h2>
          <p className="text-gray-700">
            Refunds are applicable only if:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
            <li>Wrong product delivered</li>
            <li>Product severely damaged during transit (photo/video proof required within 24 hours of delivery)</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Non-Refundable Items</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Live plants damaged due to improper care after delivery</li>
            <li>Delay caused by courier partners or natural conditions</li>
            <li>Change of mind after dispatch</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. Refund Process</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Approved refunds will be processed to the original payment method via Razorpay</li>
            <li>Refund timeline: 5–7 working days</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">5. Contact for Refund Issues</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>📧 Email: <a href="mailto:pripriyanursery@gmail.com" className="text-blue-600 hover:underline">pripriyanursery@gmail.com</a></li>
            <li>📞 Phone: +91 9679164875</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;
