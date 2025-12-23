"use client";

import { useState } from "react";
import Image from "next/image";
import Subbanner from "@/components/globals/Subbanner";
import { ShoppingCart, } from 'lucide-react'
 import { ShoppingBag } from "lucide-react";
import {
  Star,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Leaf,
} from "lucide-react";

import { addOrder } from "@/lib/order";
import { useRouter } from "next/navigation";



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





  const router = useRouter();

const handleBuyNow = () => {
  const order = {
    orderId: `ORD-${Date.now()}`,
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: "Processing",
    total: product.price,
    items: [
      {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: 1,
      },
    ],
  };

  addOrder(order);

  router.push("/my-account?tab=orders");
};


  return (
    <>
      <Subbanner />

      <section className="w-full">
        <div className="max-w-[1300px] mx-auto px-4 md:py-10  grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10">

        
 <div className="lg:sticky lg:top-24 h-fit">
  <div className="flex gap-4">

    {/* Thumbnails */}
    <div className="flex flex-col gap-3">
      {images.map((img, i) => (
        <button
          key={i}
          onClick={() => setActiveImage(img)}
          className={`border rounded p-1 transition ${
            activeImage === img
              ? "border-green-600"
              : "border-gray-200 hover:border-green-600"
          }`}
        >
          <Image
            src={img}
            alt="product thumbnail"
            width={120}
            height={120}
            className="object-contain"
          />
        </button>
      ))}
    </div>

   
    <div className="flex flex-col md:w-[480px]">

   
      <div className="rounded flex justify-center items-center border border-gray-200 md:h-[420px] relative overflow-hidden">
        <Image
          src={activeImage}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      
      <div className="flex gap-4 mt-2">
       <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-2 rounded font-medium flex items-center justify-center gap-2">
           <ShoppingCart size={16} />
           <span>Add to Cart</span>
        </button>


      

<button
  onClick={handleBuyNow}
  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
>
  <ShoppingBag size={18} />
  Buy Now
</button>

      </div>

    </div>
  </div>
</div>



          <div className="flex flex-col">

            {/* Breadcrumb */}
            <p className="text-sm text-green-600 mb-1">
              Home › <span className="text-black">{product.category ?? "Products"} ›</span> <span className="text-gray-600"> {product.name}</span>
            </p>

            {/* Title */}
            <h1 className="md:text-[32px]  mb-2 text-define-black" style={{fontWeight:'700'}}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1 bg-green-600 text-white px-2 py-[2px] rounded text-sm">
                4.9 <Star size={14} fill="white" />
              </span>
              <span className="text-[16px] text-[#555555]">
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

            

            {/* Trust Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-center mb-6">
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
