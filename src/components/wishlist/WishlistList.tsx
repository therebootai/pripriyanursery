"use client";
import WishlistHeader from "./WishlistHeader";
import WishlistItem from "./WishlistItem";
import { useCustomer } from "@/context/CustomerContext";

export default function WishlistList() {
  const { customer } = useCustomer();
 const activeWishlist =
   customer?.wishlist
     ?.filter((item) => item.status === true)
     .map((item) => item.product) ?? [];


  return (
    <div className="flex-1">
      <WishlistHeader count={activeWishlist.length ?? 0} />

      <div className="space-y-4">
        {customer && activeWishlist.length > 0 ? (
          activeWishlist.map((item) => (
            <WishlistItem key={item._id} {...item} />
          ))
        ) : (
          <p className="text-gray-500">Your wishlist is empty</p>
        )}
      </div>
    </div>
  );
}
