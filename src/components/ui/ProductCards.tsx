"use client";

import Image from "next/image";
import { ShoppingCart, Heart, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const wishlist: StoredItem[] = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    const cart: StoredItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setIsWishlisted(wishlist.some((item) => item.id === id));
    setIsInCart(cart.some((item) => item.id === id));
  }, [id]);

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

  const addToCart = () => {
    if (isInCart) return;

    const cart: ProductCardsProps[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    localStorage.setItem(
      "cart",
      JSON.stringify([...cart, { id, name, price, image, category, tag, href }])
    );
    setIsInCart(true);
  };

  return (
    <div className="rounded bg-white p-4 shadow-sm hover:shadow-md">
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
            className={
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
            }
          />
        </button>

        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      <div className="mt-4">
        {category && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-600 text-xs">
            {category}
          </span>
        )}

        <h3 className="mt-2 font-semibold text-gray-900 line-clamp-1">
          {name}
        </h3>

        {price && (
          <p className="mt-1 font-bold text-green-600">₹{price}</p>
        )}

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
            className={`flex items-center gap-1 text-xs rounded-full px-4 py-2 transition
              ${
                isInCart
                  ? "bg-green-100 text-green-700 cursor-default"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
          >
            {isInCart ? (
              <>
                <Check size={14} /> Cart Added
              </>
            ) : (
              <>
                <ShoppingCart size={14} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
