"use client";

import Image from "next/image";
import { ShoppingCart, Heart,  } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addToCart as addToCartUtil, CartItemType } from "@/utils/cart";
 import { useRouter } from "next/navigation";

type ProductCardsProps = {
  id: number;
  name: string;
  price?: number;
  image: string;
  category?: string;
  tag?: string;
  href: string;
};

type StoredItem = {
  id: number;
};

export default function ProductCards({
  id,
  name,
  price,
  image,
  category,
  tag,
  href,
}: ProductCardsProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  // Load wishlist and cart state
  useEffect(() => {
    const wishlist: StoredItem[] = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    const cart: StoredItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    setIsWishlisted(wishlist.some((item) => item.id === id));
    setIsInCart(cart.some((item) => item.id === id));
  }, [id]);

  // Toggle wishlist
  const toggleWishlist = () => {
    const wishlist: ProductCardsProps[] = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );

    if (isWishlisted) {
      const updated = wishlist.filter((item) => item.id !== id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setIsWishlisted(false);
    } else {
      localStorage.setItem(
        "wishlist",
        JSON.stringify([...wishlist, { id, name, price, image, category, tag, href }])
      );
      setIsWishlisted(true);
    }
  };

 

// Inside ProductCards component
const router = useRouter();

const addToCart = () => {
  if (isInCart) return;

  const productToAdd: CartItemType = {
    id,
    name,
    price,
    image,
    category,
    tag,
    href,
    qty: 1,
  };

  addToCartUtil(productToAdd);
  setIsInCart(true);

  // Navigate to cart page
  router.push("/cart");
};


  return (
    <div className="rounded bg-white p-4 shadow-sm hover:shadow-md">
      {/* IMAGE SECTION */}
      <div className="relative h-[180px] rounded bg-gray-100 overflow-hidden">
        {tag && (
          <span className="absolute left-2 top-2 rounded-full bg-green-600 px-3 py-1 text-xs text-white">
            {tag}
          </span>
        )}

        <button
          onClick={toggleWishlist}
          className="absolute right-2 top-2 z-10 rounded-full bg-white p-1 shadow"
        >
          <Heart
            size={18}
            className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
          />
        </button>

        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        {category && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-600 text-xs">
            {category}
          </span>
        )}

        <h3 className="mt-2 font-semibold text-gray-900 line-clamp-1">
          {name}
        </h3>

        {price && <p className="mt-1 font-bold text-green-600">₹{price}</p>}

        {/* BUTTONS */}
        <div className="mt-4 flex justify-between items-center">
          <Link
            href={`/product/${href}`}
            className="text-xs text-green-600 border rounded-full px-4 py-2 hover:bg-green-50"
          >
            More Info
          </Link>

          <button
            onClick={addToCart}
            disabled={isInCart}
            className={`
              group flex items-center justify-center gap-2
              text-xs sm:text-sm font-semibold
              px-4 sm:px-5 py-2
              rounded-full
              transition-all duration-300 ease-in-out
              ${
                isInCart
                  ? "bg-green-100 text-green-700 cursor-default shadow-inner"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30 hover:shadow-lg hover:scale-[1.04] hover:from-emerald-600 hover:to-green-500 active:scale-95"
              }
            `}
          >
            {isInCart ? (
              <>
                 <ShoppingCart
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
                <span>Go to Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart
                  size={14}
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
