"use client";

import { useEffect, useState } from "react";
import WishlistHeader from "@/components/wishlist/WishlistHeader";
import WishlistItem from "@/components/wishlist/WishlistItem";

type CartItem = {
  id: number;
  name: string;
  price?: number;
  image: string;
  href: string;
};

export default function CartList() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const data: CartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );
    setCart(data);
  }, []);

  return (
    <div>
      <WishlistHeader count={cart.length} />

      <div className="space-y-4 w-full">
        {cart.length > 0 ? (
          cart.map((item) => (
            <WishlistItem key={item.id} {...item} />
          ))
        ) : (
          <p className="text-gray-500">Your cart is empty</p>
        )}
      </div>
    </div>
  );
}
