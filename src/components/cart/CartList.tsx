"use client";

import { useEffect, useState } from "react";
import CartHeader from "./CartHeader";
import CartItem from "./CartItem";

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
     

      <CartHeader count={cart.length} />

      <div className="space-y-4 w-full">
        {cart.length > 0 ? (
          cart.map((item) => (
            <CartItem key={item.id} {...item} />
          ))
        ) : (
          <p className="text-gray-500">Your cart is empty</p>
        )}
      </div>
    </div>
  );
}
