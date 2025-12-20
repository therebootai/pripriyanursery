"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Leaf,
} from "lucide-react";

/* ================= TYPES ================= */

type TrustProps = {
  icon: React.ReactNode;
  label: string;
};

/* ================= MAIN COMPONENT ================= */

export default function DetailsProduct() {
  const images = [
    "/assets/home/category/newestproduct.png",
  "/assets/home/category/sygno1.jpg",
    "/assets/home/category/sygno2.jpg",
     "/assets/home/category/sygno3.jpg",
  ];

  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <section className="w-full ">
      <div className="max-w-[1300px] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-10">
        {/* ================= LEFT : IMAGE ONLY ================= */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`border rounded-md p-1 transition ${
                    activeImage === img
                      ? "border-green-600"
                      : "border-gray-200 hover:border-green-600"
                  }`}
                >
                  <Image
                    src={img}
                    alt="plant thumbnail"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1  rounded-lg  flex justify-center items-center">
              <Image
                src={activeImage}
                alt="main plant"
                width={400}
                height={400}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* ================= RIGHT : ALL CONTENT ================= */}
        <div className="flex flex-col">
          {/* Breadcrumb */}
          <p className="text-sm text-green-600 mb-1">
            Home › Indoor Plants › Plants title
          </p>

          {/* Title */}
          <h1 className="text-2xl font-semibold mb-2">
            Syngonium Plant (Pack of 1)
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1 bg-green-600 text-white px-2 py-[2px] rounded text-sm">
              4.9 <Star size={14} fill="white" />
            </span>
            <span className="text-sm text-gray-600">
              6,426 Ratings & 477 Reviews
            </span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-sm text-green-600 font-medium">Special price</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold">₹196</span>
              <span className="line-through text-gray-400">₹350</span>
              <span className="text-green-600 font-medium">43% off</span>
            </div>
          </div>

          {/* Pincode */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter pin code"
              className="border rounded-md px-3 py-2 text-sm w-40"
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-md text-sm font-medium">
              Check
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Delivery by <b>21 Dec 2026, Sunday</b>
          </p>

          {/* Offers */}
          <ul className="text-sm text-gray-700 space-y-1 mb-6 list-disc ml-5">
            <li>Special Price: Get extra 37% off</li>
            <li>Bank Offer: Flat ₹75 cashback on ₹399</li>
            <li>5% cashback on Axis Bank Debit Card</li>
          </ul>

          {/* Buttons */}
          <div className="flex gap-4 mb-8">
            <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-3 rounded-lg font-medium">
              Add to Cart
            </button>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium">
              Buy Now
            </button>
          </div>

          {/* Trust Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-12">
            <Trust icon={<Headphones />} label="24x7 Support" />
            <Trust icon={<RotateCcw />} label="Easy Return" />
            <Trust icon={<ShieldCheck />} label="100% Original" />
            <Trust icon={<Leaf />} label="Make in India" />
          </div>

          {/* ================= BOTTOM CONTENT (RIGHT ONLY) ================= */}
          <ProductDescription />
        </div>
      </div>
    </section>
  );
}

/* ================= TRUST COMPONENT ================= */

function Trust({ icon, label }: TrustProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center">
        {icon}
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

/* ================= DESCRIPTION + REVIEWS ================= */

function ProductDescription() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Short Details */}
      <h2 className="text-lg font-semibold mb-3">Product Short Details</h2>
     <div className="grid grid-cols-2 gap-y-2 text-sm mb-8">
  {[
    {
      title: "Easy-Care Indoor Plant",
      desc: "Syngonium is a low-maintenance indoor plant, perfect for beginners and busy plant lovers.",
    },
    {
      title: "Beautiful Arrow-Shaped Leaves",
      desc: "Its unique arrow-shaped foliage adds a fresh and modern touch to interiors.",
    },
    {
      title: "Grows in Indirect Light",
      desc: "Thrives best in bright indirect sunlight but adapts well to low-light areas.",
    },
    {
      title: "Low Water Requirement",
      desc: "Needs moderate watering and grows well without frequent maintenance.",
    },
    {
      title: "Perfect for Home & Office",
      desc: "Ideal for living rooms, bedrooms, desks, and office spaces.",
    },
  ].map((item, i) => (
    <div key={i} className="contents">
      <p className="font-medium text-[16px]">{item.title}</p>
      <p className="text-gray-600">{item.desc}</p>
    </div>
  ))}
</div>


      {/* Specification */}
      <h2 className="text-lg font-semibold mb-3">Product Description</h2>
     <div className="border rounded-md mb-4">
  <div className="grid grid-cols-2 bg-gray-50 font-medium text-sm">
    <div className="p-3 border-r">Specification</div>
    <div className="p-3">Description</div>
  </div>

  {[
    {
      spec: "Plant Type",
      desc: "Indoor foliage plant suitable for homes and offices.",
    },
    {
      spec: "Light Requirement",
      desc: "Prefers bright indirect light but tolerates low light.",
    },
    {
      spec: "Watering Needs",
      desc: "Water when the top soil feels dry; avoid overwatering.",
    },
    {
      spec: "Maintenance Level",
      desc: "Low maintenance and easy to grow.",
    },
    {
      spec: "Placement",
      desc: "Ideal for indoor spaces like living rooms and work desks.",
    },
  ].map((item, i) => (
    <div key={i} className="grid grid-cols-2 text-sm border-t">
      <div className="p-3 border-r font-medium">{item.spec}</div>
      <div className="p-3 text-gray-600">{item.desc}</div>
    </div>
  ))}
</div>


      {/* Long Text */}
      <div
  className={`overflow-hidden transition-all duration-300 text-sm text-gray-700 ${
    open ? "max-h-[2000px]" : "max-h-32"
  }`}
>
  <p>
    The Syngonium Plant, also known as the Arrowhead Plant, is a popular indoor
    plant admired for its attractive leaf shape and easy-care nature. Its lush
    green foliage adds a refreshing touch to indoor spaces and complements both
    modern and traditional interiors.
    <br /><br />
    Syngonium grows well in bright indirect light but can also adapt to low-light
    conditions, making it suitable for homes and offices. It requires moderate
    watering and prefers well-drained soil to stay healthy.
    <br /><br />
    With minimal maintenance and fast growth, Syngonium is an excellent choice
    for beginners as well as experienced plant lovers. Regular trimming helps
    maintain its shape and encourages bushier growth.
    <br></br>
    Syngonium grows well in bright indirect light but can also adapt to low-light
    conditions, making it suitable for homes and offices. It requires moderate
    watering and prefers well-drained soil to stay healthy.
  </p>
</div>

<button
  onClick={() => setOpen(!open)}
  className="mt-2 text-green-600 text-sm font-medium hover:underline"
>
  {open ? "" : "Read More"}
</button>


      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Ratings & Reviews</h2>

        <div className="flex gap-3 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Image
              key={i}
              src="/assets/plant.png"
              alt="review"
              width={64}
              height={64}
              className="rounded-md border object-cover"
            />
          ))}
        </div>

        <p className="text-sm font-medium flex items-center gap-2">
          <span className="bg-green-600 text-white px-2 py-[2px] rounded text-xs">
            5 ★
          </span>
          Excellent
        </p>
        <p className="text-sm text-gray-600">
          Nice plant healthy and fresh
        </p>
      </div>
    </div>
  );
}
