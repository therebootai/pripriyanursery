"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import { Star, ShieldCheck, RotateCcw, Headphones, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import { CartType, ProductType } from "@/types/types";
import { useInView } from "react-intersection-observer";
import { useCustomer } from "@/context/CustomerContext";
import { addToCartApi } from "@/library/cart";
import toast from "react-hot-toast";
import Link from "next/link";

type TrustProps = {
  icon: React.ReactNode;
  label: string;
};

const ProductDetails = ({ product }: { product: ProductType }) => {
  const { customer, refreshCustomer } = useCustomer();
  const isInCart = customer?.cart?.some(
    (item: CartType) => item.productId?._id === product._id
  );

  const [variantLoading, setVariantLoading] = useState(false);
  const [variantProducts, setVariantProducts] = useState<ProductType[]>([]);

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

  const { ref: imageRef, inView } = useInView({
    threshold: 0.3,
  });

  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const router = useRouter();

  const handleCart = async () => {
    if (!customer) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (isInCart) {
      router.push("/cart");
      return;
    }

    try {
      await addToCartApi(
        customer._id,
        product._id,
        undefined,
        1,
        product.price
      );
      await refreshCustomer();
      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    try {
      if (!customer) {
        toast.error("Please login to proceed");
        return;
      }

      if (isInCart) {
        router.push("/checkout");
        return;
      }

      await addToCartApi(
        customer._id,
        product._id,
        undefined,
        1,
        product.price
      );

      await refreshCustomer();
      router.push("/checkout");
    } catch (err) {
      console.error(err);
      toast.error("Failed to proceed");
    }
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
      {variantLoading && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <section className="w-full">
        <div className=" flex flex-col md:flex-row gap-4 md:gap-10">
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3">
                <div>
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
                          className="object-contain size-15 lg:size-20"
                        />
                      </button>
                    ))}
                </div>
              </div>

              <div className="flex flex-col md:w-[480px] gap-2">
                <div
                  ref={imageRef}
                  className="rounded flex justify-center items-center border border-gray-200 md:h-105 relative overflow-hidden"
                >
                  <Image
                    src={activeImage?.url}
                    alt={activeImage.public_id}
                    width={500}
                    height={500}
                    className="object-cover"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-2 rounded font-medium flex items-center justify-center gap-2"
                    onClick={handleCart}
                  >
                    <ShoppingCart size={16} />
                    {isInCart ? "Go to Cart" : "Add to Cart"}
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

          <div className="flex flex-col gap-3">
            {/* Breadcrumb */}
            <p className="text-sm text-green-600">
              Home ›{" "}
              <span className="text-black">
                {/* {product.category ?? "Products"} › */}
              </span>{" "}
              <span className="text-gray-600"> {product.name}</span>
            </p>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl text-defined-black font-semibold leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 w-full">
              <span className="flex items-center gap-1 bg-green-600 text-white px-2 py-[2px] rounded text-sm">
                4.9 <Star size={14} fill="white" />
              </span>
              <span className="text-[16px] text-gray-600">
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
                  ₹{product.mrp}
                </span>
                <span className="bg-defined-green text-white px-2 py-1 text-xs rounded font-medium">
                  {product.discount}% Off
                </span>
              </div>
            </div>

            {/* Pincode */}
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter pin code"
                maxLength={6}
                className="border w-full border-gray-200 outline-none placeholder:text-gray-400 text-defined-black rounded-md px-3 py-2 text-sm md:w-40"
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
            <div>
              <h2 className="text-defined-black font-semibold">
                Available Offers
              </h2>
              <ul className="text-sm text-gray-700 space-y-1 mb-6 list-disc ml-5">
                <li>Special Price: Extra discount applied</li>
                <li>Bank Offer: Flat ₹75 cashback</li>
                <li>5% cashback on Axis Bank Card</li>
              </ul>
            </div>

            {/* {product.isVariant && <p className="text-sm text-gray-600 mb-6">Select Colour</p>} */}

            {product.variants && product.variants.length > 0 && (
              <div className="flex items-center gap-3 mb-3">
                {product.variants.map((variant: ProductType) => (
                  <Link
                    href={`/product/${variant.slug}`}
                    key={variant._id}
                    className={`${
                      variant._id === product._id
                        ? "border-green-600"
                        : "border-gray-200 hover:border-green-600"
                    } border-2 rounded-md p-1 size-20`}
                  >
                    <Image
                      src={variant.coverImage.url}
                      alt={variant.name}
                      width={50}
                      height={50}
                      className="object-cover w-full h-full"
                    />
                  </Link>
                ))}
              </div>
            )}

            {/* Trust Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-center mb-6">
              <Trust icon={<Headphones />} label="24x7 Support" />
              <Trust icon={<RotateCcw />} label="Easy Return" />
              <Trust icon={<ShieldCheck />} label="100% Original" />
              <Trust icon={<Leaf />} label="Made in India" />
            </div>

            {/* ================= DESCRIPTION (CONNECTED) ================= */}
            {product.shortDescription && (
              <div>
                <h2 className="text-lg font-semibold text-defined-black mb-3">
                  Product Short Details
                </h2>

                <p
                  className="text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: product.shortDescription,
                  }}
                ></p>
              </div>
            )}

            {product.specifications && (
              <div className="pt-6">
                {/* ================= MASKED CONTENT ================= */}
                <div
                  className={`relative overflow-hidden transition-all duration-500 ${
                    open ? "max-h-[5000px]" : "max-h-[120px]"
                  }`}
                >
                  <div className="w-full">
                    <h2 className="text-lg font-semibold text-defined-black mb-3">
                      Specifications
                    </h2>

                    <table className="w-full">
                      <tbody>
                        {product.specifications.map(
                          (spec: any, index: number) => (
                            <tr key={index} className="odd:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-2 font-semibold text-xs lg:text-sm text-defined-black w-1/3">
                                {spec.name}
                              </td>
                              <td className="border border-gray-200 px-4 py-2 text-xs lg:text-sm text-gray-700">
                                {spec.details}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {!open && (
                    <div className="absolute bottom-0 left-0 w-full h-14 bg-linear-to-t from-white to-transparent pointer-events-none" />
                  )}
                </div>

                <div className={`relative z-10 ${open ? "mt-3" : "-mt-3"}`}>
                  <button
                    onClick={() => setOpen(!open)}
                    className="pl-2 text-green-600 text-xs font-medium hover:underline cursor-pointer"
                  >
                    {open ? "Read Less" : "Read More"}
                  </button>
                </div>
              </div>
            )}

            {product.longDescription && (
              <div className="pt-6">
                <h2 className="text-lg font-semibold text-defined-black mb-3">
                  Product Details
                </h2>

                <div
                  className="text-sm text-gray-700 leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{
                    __html: product.longDescription,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
      {/* ================= MOBILE STICKY BUY BAR ================= */}
      {!inView && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 flex gap-3 md:hidden z-50">
          <button
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-3 rounded font-medium flex items-center justify-center gap-2"
            onClick={handleCart}
          >
            <ShoppingCart size={16} />
            {isInCart ? "Go to Cart" : "Add to Cart"}
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-medium flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            Buy Now
          </button>
        </div>
      )}
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
