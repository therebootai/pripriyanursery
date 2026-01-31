"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import { Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductType } from "@/types/types";
import { useInView } from "react-intersection-observer";
import { useCustomer } from "@/context/CustomerContext";
import { addToCartApi } from "@/library/cart";
import toast from "react-hot-toast";
import Link from "next/link";
import SinglePageImagesComponent from "./SinglePageImagesComponent";
import { removeWishlistApi, toggleWishlistApi } from "@/library/wishlist";
import ShareModal from "./ShareModel";
import ReviewCard from "./ProductReview";
import CustomerAuthModal from "../customer/CustomerAuthModal";
import ProductRatingSummary from "./ProductRatingSummary";
import { useCartPreview } from "@/context/CartPreviewContext";
import { FaRupeeSign } from "react-icons/fa";

type TrustProps = {
  icon: string;
  label: string;
};

export interface ProductVariantResponse {
  selectedProduct: ProductType;
  variants: ProductType[];
}

const ProductDetails = ({ product }: { product: ProductType }) => {
  const { customer, refreshCustomer } = useCustomer();
  const isInCart = (customer?.cart ?? []).some((item) => {
    if (!item.productId) return false;

    const cartProductId =
      typeof item.productId === "object" ? item.productId._id : item.productId;

    return cartProductId === product._id;
  });

  const [variantLoading, setVariantLoading] = useState(false);

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

  const [currentProduct, setCurrentProduct] = useState<ProductType>(product);

  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [stockStatus, setStockStatus] = useState<"available" | "low" | "out">(
    "available",
  );

  const [showShare, setShowShare] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const [availableCoupons, setAvailableCoupons] = useState<any>([]);

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Hide when within 100px of bottom
      const atBottom = scrollTop + windowHeight >= documentHeight - 100;
      setIsScrolledToBottom(atBottom);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add this useEffect after the existing useEffect for variants
  useEffect(() => {
    const stock = currentProduct.stock || 0;
    if (stock === 0) {
      setStockStatus("out");
    } else if (stock <= 3) {
      setStockStatus("low");
    } else {
      setStockStatus("available");
    }
  }, [currentProduct.stock]);

  const getAttributeValue = (
    product: ProductType,
    attrName: string,
  ): string | null => {
    const attr = product.variables?.find((v) => v.name === attrName);

    if (attr?.values?.length) return attr.values[0];

    if (!product.isVariant) {
      if (attrName === "Color") return `${" "}`;
      if (attrName === "Size") return "";
    }

    return null;
  };

  const groupByAttribute = (variants: ProductType[], attrName: string) => {
    return variants.reduce<Record<string, ProductType[]>>((acc, v) => {
      const value = getAttributeValue(v, attrName);
      if (!value) return acc;

      if (!acc[value]) acc[value] = [];
      acc[value].push(v);
      return acc;
    }, {});
  };

  const variants = currentProduct.variants || [];

  const showVariants = variants.length > 1;

  const colorGroups = groupByAttribute(variants, "Color");
  const sizeGroups = groupByAttribute(variants, "Size");

  const hasColor = Object.keys(colorGroups).length > 0;
  const hasSize = Object.keys(sizeGroups).length > 0;

  const router = useRouter();
  const { showPreview } = useCartPreview();

  const handleCart = async () => {
    if (!customer) {
      toast.error("Please login to add items to cart");
      setIsSignupOpen(true);
      return;
    }
    if (isInCart) {
      router.push("/my-cart");
      return;
    }

    try {
      await addToCartApi(
        customer._id,
        product._id,
        undefined,
        1,
        product.price,
      );
      await refreshCustomer();
      showPreview({
        _id: product._id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        discount: product.discount,
        image: product.coverImage?.url || product.images?.[0]?.url || "",
      });
      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (stockStatus === "out") {
      toast.error("This product is out of stock");
      return;
    }
    try {
      if (!customer) {
        toast.error("Please login to proceed");
        setIsSignupOpen(true);
        return;
      }

      // ✅ STORE BUY NOW ITEM
      sessionStorage.setItem(
        "BUY_NOW_ITEM",
        JSON.stringify({
          productId: product,
          variantId: undefined,
          quantity: 1,
          price: product.price,
        }),
      );

      router.push("/checkout?mode=buy-now");
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
        },
      );

      const data = await res.json();

      if (data.result !== "1" || !data.data?.length) {
        setError("Delivery not available to this pincode");
        return;
      }

      const cheapest = data.data.reduce((min: any, curr: any) =>
        curr.total_charges < min.total_charges ? curr : min,
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

  const fetchProductWithVariants = async (
    slug: string,
  ): Promise<ProductVariantResponse> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/variants/${slug}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await res.json();
    return {
      selectedProduct: data.data.selectedProduct,
      variants: data.data.variants,
    };
  };

  useEffect(() => {
    if (!slug) return;

    const loadVariants = async () => {
      try {
        setVariantLoading(true);

        const { selectedProduct, variants } =
          await fetchProductWithVariants(slug);

        setCurrentProduct({
          ...selectedProduct,
          variants,
        });
        setActiveImage(
          selectedProduct.images?.[0] ?? selectedProduct.coverImage,
        );
      } catch (err) {
        console.error("Variant fetch failed", err);
      } finally {
        setVariantLoading(false);
      }
    };

    loadVariants();
  }, [slug]);

  const productImages: string[] = [
    ...(currentProduct.images?.map((img) => img.url) ?? []),
    ...(currentProduct.coverImage?.url ? [currentProduct.coverImage.url] : []),
  ];

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const customerId = customer?._id;

  const handleWishlist = async () => {
    if (!customerId) {
      setIsSignupOpen(true); // Open the modal
      return;
    }

    if (loading) return;

    setLoading(true);
    setIsWishlisted((prev) => !prev);

    try {
      if (isWishlisted) {
        await removeWishlistApi(customerId, product._id);
        toast.success("Removed from wishlist");
      } else {
        await toggleWishlistApi(customerId, product._id);
        toast.success("Added to wishlist");
      }

      await refreshCustomer();
    } catch (err) {
      console.error(err);
      setIsWishlisted((prev) => !prev);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!customer || !customer.wishlist) return;

    const exists = customer.wishlist.some(
      (item: any) =>
        String(item.product?._id || item.product) === String(product._id) &&
        item.status === true,
    );

    setIsWishlisted(exists);
  }, [customer, product._id]);

  const handleShare = () => setShowShare(true);

  const { ref: buttonRef, inView: buttonsInView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 0px 0px",
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon`);
        const data = await res.json();

        setAvailableCoupons(data.coupons || []);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <>
      {/* {variantLoading && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )} */}

      <section className="w-full max-md:mt-4">
        <div className=" flex flex-col lg:flex-row gap-4 md:gap-10">
          <div className="lg:sticky lg:top-24 h-fit w-full lg:w-[50%] xl:w-[45%] xxl:w-[40%] z-10">
            <div className="flex flex-col w-full gap-2">
              <SinglePageImagesComponent
                images={productImages}
                isWishlisted={isWishlisted}
                onWishlist={handleWishlist}
                onShare={handleShare}
              />

              <div ref={buttonRef} className="flex gap-4">
                <div className=" max-lg:hidden lg:w-16"></div>
                <button
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-2 rounded font-medium flex items-center justify-center gap-2"
                  onClick={handleCart}
                >
                  <ShoppingCart size={16} />
                  {isInCart ? "Go to Cart" : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={stockStatus === "out"}
                  className={`flex-1 py-2 rounded font-medium flex items-center justify-center gap-2 transition-all ${
                    stockStatus === "out"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <ShoppingBag size={18} />
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full lg:w-[50%] xl:w-[55%] xxl:w-[60%]">
            {/* Breadcrumb */}
            <p className="text-sm text-green-600 flex flex-wrap gap-2">
              Home ›{" "}
              <span className="text-black flex flex-wrap">
                {product.categoryLevels?.map((cat: any, index: number) => (
                  <div key={cat._id} className="">
                    <Link
                      href={`/products?category=${encodeURIComponent(cat.name)}`}
                      className="t"
                    >
                      {cat.name} {">"}
                    </Link>
                  </div>
                ))}
              </span>{" "}
              <span className="text-black"> {product.name}</span>
            </p>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl text-defined-black font-semibold leading-tight">
              {product.name}
            </h1>

            {/* Place this ABOVE your Product Title <h1> */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {product.categoryLevels?.map((cat: any, index: number) => (
                <div key={cat._id} className="flex items-center">
                  {/* Separator only if not the first item */}
                  {index > 0 && (
                    <span className="text-gray-300 mx-2 text-[10px]">•</span>
                  )}

                  <Link
                    href={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="text-[11px] md:text-xs font-bold tracking-widest uppercase text-green-700 hover:text-green-900 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </div>
              ))}
            </div>

            {/* Rating */}
            <Link
              href={`/product/${product.slug}#reviews`}
              className="flex items-center gap-2 w-full"
            >
              <span className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-sm">
                {product.averageRating.toFixed(1)}{" "}
                <Star size={14} fill="white" />
              </span>
              <span className="text-[16px] text-gray-600">
                {product.ratingCount.toLocaleString()} Ratings &{" "}
                {product.reviews.length} Reviews
              </span>
            </Link>

            {/* Price */}
            <div className="">
              <p className="text-sm text-green-600 font-medium">
                Special price
              </p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold text-defined-green">
                  <FaRupeeSign className="inline" />
                  {product.price.toFixed(0)}
                </span>
                <span className="line-through text-gray-400">
                  <FaRupeeSign className="inline" />
                  {product.mrp.toFixed(0)}
                </span>
                <span className="bg-defined-green text-white px-2 py-1 text-xs rounded font-medium">
                  {product.discount}% Off
                </span>
              </div>
            </div>
            <div className=" flex items-center gap-2">
              {stockStatus === "out" && (
                <div className="flex items-center gap-1 bg-red-100 text-red-700 px-5 py-2 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Out of Stock
                </div>
              )}
              {stockStatus === "low" && (
                <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-5 py-2 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  Only {currentProduct.stock} left!
                </div>
              )}
              {stockStatus === "available" && (
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  {currentProduct.stock} in stock
                </div>
              )}
            </div>

            {showVariants && (
              <div className="space-y-6 mb-4">
                {hasColor && (
                  <div>
                    <p className="font-medium mb-2">Color</p>

                    <div className="flex gap-3">
                      {Object.entries(colorGroups).map(([color, products]) => {
                        const variant = products[0]; // representative

                        return (
                          <Link
                            key={variant._id}
                            href={`/product/${variant.slug}`}
                            className={`border rounded-md p-1 size-20 text-center ${
                              variant._id === currentProduct._id
                                ? "border-green-600"
                                : "border-gray-200 hover:border-green-600"
                            }`}
                          >
                            <Image
                              src={variant.coverImage.url}
                              alt={color}
                              width={60}
                              height={60}
                              className="object-cover mx-auto w-full h-full"
                            />
                            <p className="text-xs mt-1">{color}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
                {hasSize && (
                  <div>
                    <p className="font-medium mb-2">Size</p>

                    <div className="flex gap-2">
                      {Object.entries(sizeGroups).map(([size, products]) => {
                        const variant = products[0];

                        return (
                          <Link
                            key={variant._id}
                            href={`/product/${variant.slug}`}
                            className={`px-4 py-2 border rounded-md text-sm ${
                              variant._id === currentProduct._id
                                ? "border-green-600 text-green-600"
                                : "border-gray-300 hover:border-green-600"
                            }`}
                          >
                            {size}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                {availableCoupons
                  .filter(
                    (c: {
                      code: string;
                      usageLimit: number;
                      status: boolean;
                    }) => c.status !== false && c.usageLimit > 0,
                  )
                  .slice(0, 5)
                  .map((c: { code: string; name: string }) => (
                    <li key={c.code}>
                      {c.name} - Use {c.code}
                    </li>
                  ))}
                {/* <li>Flat discount for new users - Use PPNNEW</li>
                <li>Flat 20% OFF on cart value - Use PPNCART20</li>
                <li>Extra 10% OFF for existing users - Use PPNEXTRA10</li> */}
              </ul>
            </div>

            {/* Trust Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-center mb-6">
              <Trust icon={"/icons/24x7support.svg"} label="24x7 Support" />
              <Trust icon={"/icons/easyreturn.svg"} label="Easy Return" />
              <Trust
                icon={"/icons/originalproduct.svg"}
                label="100% Original"
              />
              <Trust icon={"/icons/makeinindia.svg"} label="Made in India" />
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

            {product.specifications && product.specifications.length > 0 && (
              <div className="pt-6  relative">
                {/* ================= MASKED CONTENT ================= */}
                <div
                  className={`relative overflow-hidden transition-all  duration-500 ${
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
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>

                  {!open && (
                    <div className="absolute bottom-0 left-0 w-full h-14 bg-linear-to-t from-white/50 to-transparent pointer-events-none" />
                  )}
                </div>
                {product.specifications.length > 1 && (
                  <div className={`relative mt-2`}>
                    <button
                      onClick={() => setOpen(!open)}
                      className="pl-4 text-green-600 text-xs font-medium  hover:text-green-900 cursor-pointer z-10"
                    >
                      {open ? "Read Less" : "Read More"}
                    </button>
                  </div>
                )}
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
            {/* <ReviewCard review={product.reviews} /> */}
            <div className="flex flex-col gap-2.5" id="reviews">
              <h2 className="text-lg font-semibold text-defined-black mb-3">
                Ratings &amp; Reviews
              </h2>
              <ProductRatingSummary
                averageRating={product.averageRating}
                ratingCount={product.ratingCount}
                ratingBreakdown={product.ratingBreakdown}
                reviewsCount={product.reviews.length}
              />
              {product.reviews.map((review: any) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ================= MOBILE STICKY BUY BAR ================= */}
      {!buttonsInView && !isScrolledToBottom && (
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
            disabled={stockStatus === "out"}
            className={`flex-1 py-3 rounded font-medium flex items-center justify-center gap-2 transition-all ${
              stockStatus === "out"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <ShoppingBag size={18} />
            Buy Now
          </button>
        </div>
      )}

      <ShareModal
        open={showShare}
        onClose={() => setShowShare(false)}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
      <CustomerAuthModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </>
  );
};

export default ProductDetails;

/* ================= TRUST COMPONENT ================= */

function Trust({ icon, label }: TrustProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className=" relative size-16">
        <Image src={icon} alt="icons" fill className="" />
      </div>

      <p className="text-lg font-medium text-gray-800">{label}</p>
    </div>
  );
}
