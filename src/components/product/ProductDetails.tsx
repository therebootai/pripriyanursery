"use client";

import { useState } from "react";
import Image from "next/image";
import Subbanner from "@/components/globals/Subbanner";
import { ShoppingCart } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import { Star, ShieldCheck, RotateCcw, Headphones, Leaf } from "lucide-react";

import { addOrder } from "@/lib/order";
import { useRouter } from "next/navigation";
import { ProductType } from "./ProductSection";

type TrustProps = {
  icon: React.ReactNode;
  label: string;
};

const truncateWords = (text = "", limit = 10) => {
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

const ProductDetails = ({ product }: { product: ProductType }) => {
  const images = product.images || [];

  const [activeImage, setActiveImage] = useState(images[0]);
  const [open, setOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [checking, setChecking] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<null | {
    charge: number;
    courier: string;
    deliveryDate: string;
  }>(null);

  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

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
          image: product.coverImage,
          price: product.price,
          qty: 1,
        },
      ],
    };

    addOrder(order as any);

    router.push("/my-account?tab=orders");
  };

  const getDeliveryDate = (estimated: string): string => {
    const days = parseInt(estimated); // "2 Days" → 2

    if (isNaN(days)) return "";

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);

    return deliveryDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "long",
    });
  };

  const handleCheckPincode = async () => {
    if (pincode.length !== 6) {
      setError("Please enter a valid 6 digit pincode");
      return;
    }

    setChecking(true);
    setError(null);
    setDeliveryInfo(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/rate-calculator`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.productId,
            deliveryPincode: pincode,
            paymentType: "PREPAID",
          }),
        }
      );

      const data = await res.json();

      if (data.result !== "1" || !data.data?.length) {
        setError("Delivery not available to this pincode");
        return;
      }

      const cheapest = data.data.reduce((min: any, curr: any) =>
        curr.total_charges < min.total_charges ? curr : min
      );

      const deliveryDate = getDeliveryDate(cheapest.estimated_delivery);

      setDeliveryInfo({
        charge: cheapest.total_charges,
        courier: cheapest.name,
        deliveryDate,
      });
      setHasChecked(true);
    } catch (err) {
      setError("Something went wrong while checking delivery");
    } finally {
      setChecking(false);
    }
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
                {images.length > 0 &&
                  images.map((img, i) => (
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
                        src={img.url}
                        alt={img.public_id}
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
                    src={activeImage.url}
                    alt={activeImage.public_id}
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
              Home ›{" "}
              <span className="text-black">
                {/* {product.category ?? "Products"} › */}
              </span>{" "}
              <span className="text-gray-600"> {product.name}</span>
            </p>

            {/* Title */}
            <h1
              className="md:text-[32px]  mb-2 text-defined-black"
              style={{ fontWeight: "700" }}
            >
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
                <span className="text-3xl font-semibold text-defined-green">
                  ₹{product.price}
                </span>
                <span className="line-through text-gray-400">
                  ₹{Math.round(product.price * 1.8)}
                </span>
                <span className="text-green-600 font-medium">
                  {product.discount}% Off
                </span>
              </div>
            </div>

            {/* Pincode */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter pin code"
                maxLength={6}
                className="border border-gray-200 outline-none placeholder:text-gray-400 text-defined-black rounded-md px-3 py-2 text-sm w-40"
              />
              <button
                type="button"
                onClick={handleCheckPincode}
                disabled={checking}
                className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-md text-sm font-medium"
              >
                {checking ? "Checking..." : "Check"}
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {!hasChecked && (
                <span className="italic text-gray-400">
                  Check delivery date
                </span>
              )}

              {hasChecked && deliveryInfo && (
                <>
                  Delivery by{" "}
                  <b className="text-defined-black">
                    {deliveryInfo.deliveryDate}
                  </b>
                </>
              )}

              {hasChecked && !deliveryInfo && (
                <span className="text-red-600">
                  Delivery not available for this pincode
                </span>
              )}
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
            {product.shortDescription && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-defined-black mb-3">
                  Product Description
                </h2>

                <p
                  className="text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                >
                  {/* {open
                    ? product.shortDescription
                    : truncateWords(product.shortDescription, 10)} */}
                </p>

                {!open && product.shortDescription.split(" ").length > 10 && (
                  <button
                    onClick={() => setOpen(true)}
                    className="mt-2 text-green-600 text-sm font-medium hover:underline"
                  >
                    Read More
                  </button>
                )}

                {open && (
                  <div className="mt-6 space-y-6">
                    {product.shortDescription.split("\n").map((item, i) => (
                      <p key={i}>{item}</p>
                    ))}
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
      <p className="text-sm font-medium text-defined-green">{label}</p>
    </div>
  );
}
