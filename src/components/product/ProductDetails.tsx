"use client";

import { useState } from "react";
import Image from "next/image";
import Subbanner from "@/components/globals/Subbanner";
import {
  Star,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Leaf,
} from "lucide-react";


type ProductType = {
  id: number;
  name: string;
  price: number;
  image: string;
  gallery?: string[];
  category?: string;
  des:string;

  description?: {
    full?: string;
    benefits?: string[];
    care?: string[];
    extra?: string;
  };
};

type TrustProps = {
  icon: React.ReactNode;
  label: string;
};



const truncateWords = (text = "", limit = 10) => {
  const words = text.split(" ");
  return words.length > limit
    ? words.slice(0, limit).join(" ") + "..."
    : text;
};



const ProductDetails = ({ product }: { product: ProductType }) => {
  const images = product.gallery?.length
    ? product.gallery
    : [product.image];

  const [activeImage, setActiveImage] = useState(images[0]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Subbanner />

      <section className="w-full">
        <div className="max-w-[1300px] mx-auto px-4 md:py-10  grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-10">

          {/* ================= LEFT : IMAGE ================= */}
        {/* ================= LEFT : IMAGE ================= */}
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
            alt="product thumbnail"
            width={80}
            height={80}
            className="object-contain"
          />
        </button>
      ))}
    </div>

    {/* IMAGE + BUTTONS WRAPPER */}
    <div className="flex-1 flex flex-col">

      {/* Main Image */}
      <div className="rounded-lg flex justify-center items-center">
        <Image
          src={activeImage}
          alt={product.name}
          width={420}
          height={420}
          className="object-contain"
        />
      </div>

      {/* Buttons (MATCH IMAGE WIDTH) */}
      <div className="flex gap-4 mt-2 w-full">
        <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-3 rounded-lg font-medium">
          Add to Cart
        </button>
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium">
          Buy Now
        </button>
      </div>

    </div>
  </div>
</div>


          {/* ================= RIGHT : CONTENT ================= */}
          <div className="flex flex-col">

            {/* Breadcrumb */}
            <p className="text-sm text-green-600 mb-1">
              Home › {product.category ?? "Products"} › {product.name}
            </p>

            {/* Title */}
            <h1 className="text-2xl font-semibold mb-2">
              {product.name}
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
              <p className="text-sm text-green-600 font-medium">
                Special price
              </p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold">
                  ₹{product.price}
                </span>
                <span className="line-through text-gray-400">
                  ₹{Math.round(product.price * 1.8)}
                </span>
                <span className="text-green-600 font-medium">
                  43% off
                </span>
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
              <li>Special Price: Extra discount applied</li>
              <li>Bank Offer: Flat ₹75 cashback</li>
              <li>5% cashback on Axis Bank Card</li>
            </ul>

            {/* Buttons */}

            {/* <div className="flex gap-4 mb-8">
              <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-3 rounded-lg font-medium">
                Add to Cart
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium">
                Buy Now
              </button>
            </div> */}

            {/* Trust Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-12">
              <Trust icon={<Headphones />} label="24x7 Support" />
              <Trust icon={<RotateCcw />} label="Easy Return" />
              <Trust icon={<ShieldCheck />} label="100% Original" />
              <Trust icon={<Leaf />} label="Made in India" />
            </div>

            {/* ================= DESCRIPTION (CONNECTED) ================= */}
            {product.description?.full && (
              <div className="border-t pt-6">

                <h2 className="text-lg font-semibold mb-3">
                  Product Description
                </h2>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {open
                    ? product.description.full
                    : truncateWords(product.description.full, 10)}
                </p>

                {!open &&
                  product.description.full.split(" ").length > 10 && (
                    <button
                      onClick={() => setOpen(true)}
                      className="mt-2 text-green-600 text-sm font-medium hover:underline"
                    >
                      Read More
                    </button>
                  )}

                {open && (
                  <div className="mt-6 space-y-6">

                  {product.des}

                    {/* {product.description.benefits?.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">
                          Key Benefits
                        </h3>
                        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                          {product.description.benefits.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.description.care?.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">
                          Care Instructions
                        </h3>
                        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                          {product.description.care.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.description.extra && (
                      <div>
                        <h3 className="font-semibold mb-2">
                          Additional Information
                        </h3>
                        <p className="text-sm text-gray-700">
                          {product.description.extra}
                        </p>
                      </div>
                    )} */}

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;

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
