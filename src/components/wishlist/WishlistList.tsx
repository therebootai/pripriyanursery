"use client";

import { useEffect, useState } from "react";
import WishlistHeader from "./WishlistHeader";
import WishlistItem from "./WishlistItem";

type WishlistProduct = {
  id: number;
  name: string;
  price?: number;
  image: string;
  href: string;
};

export default function WishlistList() {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);

  useEffect(() => {
    const data: WishlistProduct[] = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    setWishlist(data);
  }, []);

  return (
    <div className="flex-1">
      <WishlistHeader count={wishlist.length} />

      <div className="space-y-4">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <WishlistItem key={item.id} {...item} />
          ))
        ) : (
          <p className="text-gray-500">Your wishlist is empty</p>
        )}
      </div>
    </div>
  );
}
