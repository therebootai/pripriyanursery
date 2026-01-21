"use client";

import Image from "next/image";
import { ShoppingCart, Heart,  } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCustomer } from "@/context/CustomerContext";
import { removeWishlistApi, toggleWishlistApi } from "@/library/wishlist";
import { addToCartApi, removeFromCartApi } from "@/library/cart";
import { ProductType } from "@/types/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";



export default function ProductCards({
  _id,
  name,
  price,
  coverImage,
  images,
  brand,
  longDescription,
  shortDescription,
  mrp,
  discount,
  // averageRating,
  // ratingCount,
  // ratingBreakdown,
  // image,
  // category,
  // tag,
  slug,
}: ProductType) {
  const { customer, refreshCustomer } = useCustomer();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const router = useRouter()

  const customerId = customer?._id;

const handleWishlist = async () => {
  if (!customerId || loading) return;

  setLoading(true);
  setIsWishlisted((prev) => !prev);

  try {
      if (isWishlisted) {
      // 🔴 Explicit remove
      await removeWishlistApi(customerId, _id);
      toast.success("Removed from wishlist");
    } else {
      // 🟢 Add
      await toggleWishlistApi(customerId, _id);
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

const handleCart = async () => {
  if (!customerId || loading) return;

  setLoading(true);

  try {
    if (isInCart) {
       router.push('/my-cart');
       return
    } else {
      await addToCartApi(customerId, _id, undefined, 1, price);
    }
 await refreshCustomer();

    setIsInCart(!isInCart);
    toast.success(isInCart ? "Removed from cart" : "Added to cart");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update cart");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!customer || !customer.wishlist) return;

  const exists = customer.wishlist.some(
    (item: any) =>
      String(item.product?._id || item.product) === String(_id) &&
      item.status === true
  );

  setIsWishlisted(exists);
}, [customer, _id]);


useEffect(() => {
  if (!customer || !customer.cart) return;

  const exists = customer.cart.some(
    (item: any) => String(item.productId?._id || item.productId) === String(_id)
  );

  setIsInCart(exists);
}, [customer, _id]);


  return (
    <div className="relative rounded bg-white p-1 md:p-2 shadow-sm hover:shadow-md w-full h-auto flex flex-col justify-between">
      <Link
        href={`/product/${slug}`}
        className="absolute inset-0 z-10 md:hidden"
        aria-label={`View ${name}`}
      ></Link>
      {/* IMAGE SECTION */}
      <div className="relative rounded bg-gray-100 overflow-hidden">
        {/* {tag && (
          <span className="absolute left-2 top-2 rounded-full bg-green-600 px-3 py-1 text-xs text-white">
            {tag}
          </span>
        )} */}

        <button
          onClick={handleWishlist}
          className="absolute right-2 top-2 z-20 rounded-full bg-white/50 p-1 shadow"
        >
          <Heart
            size={18}
            className={`
              transition-all duration-300
              ${
                isWishlisted
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-800"
              }
            `}
          />
        </button>

        <div className="h-[8rem] md:h-[10rem] lg:h-[12rem] xxl:h-[14rem]">
          <Image
            src={coverImage.url}
            alt={coverImage.public_id}
            height={500}
            width={500}
            className="object-cover h-full w-full"
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className=" pt-2 flex flex-col">
        {/* {category && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-600 text-xs">
            {category}
          </span>
        )} */}

        <div className="flex justify-between items-center">
          <h3 className="text-xs md:text-sm  font-semibold text-defined-black line-clamp-1">
            {name}
          </h3>

          <button
            onClick={handleCart}
            // disabled={isInCart}
            className={`cursor-pointer relative z-20 
              md:hidden group flex items-center justify-center gap-2
               font-semibold
              p-2
              rounded-full
              transition-all duration-300 ease-in-out
              ${
                !isInCart
                  ? "bg-green-100 text-green-700 cursor-default shadow-inner"
                  : "bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30 hover:shadow-lg hover:scale-[1.04] hover:from-emerald-600 hover:to-green-500 active:scale-95"
              }
            `}
          >
            {isInCart ? (
              <>
                <ShoppingCart
                  size={10}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />                
              </>
            ) : (
              <>
                <ShoppingCart
                  size={10}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </div>

        <div>
          <span className="text-xs md:text-lg font-bold text-defined-green">
            ₹{price.toFixed(0)}
          </span>
          {discount > 0 && (
            <span className="ml-1 md:ml-2 text-[10px] md:text-xs text-gray-500 line-through">
              ₹{mrp.toFixed(0)}
            </span>
          )}
          {discount > 0 && (
            <span className="ml-1 md:ml-2 text-[10px] md:text-xs text-red-500">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* BUTTONS */}
        <div className="mt-2 hidden md:flex justify-between items-center">
          <Link
            href={`/product/${slug}`}
            className="text-xs  text-green-600 border rounded-full px-3 py-2 hover:bg-green-50"
          >
            More Info
          </Link>

          <button
            onClick={handleCart}
            // disabled={isInCart}
            className={`cursor-pointer relative z-20 
             group flex items-center justify-center gap-2
              text-xs  font-semibold
              px-3  py-2
              rounded-full
              transition-all duration-300 ease-in-out
              ${
                !isInCart
                  ? "bg-green-100 text-green-700 cursor-default shadow-inner"
                  : "bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30 hover:shadow-lg hover:scale-[1.04] hover:from-emerald-600 hover:to-green-500 active:scale-95"
              }
            `}
          >
            {isInCart ? (
              <>
                <ShoppingCart
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
                <span>Go to Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
