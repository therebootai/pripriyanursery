"use client";

import { useEffect, useState } from "react";
import WishlistHeader from "./WishlistHeader";
import WishlistItem from "./WishlistItem";
import axios from "axios";
import { ProductType } from "../product/ProductSection";
import { useCustomer } from "@/context/CustomerContext";

export default function WishlistList() {
  const {customer} = useCustomer();
  const [wishlist, setWishlist] = useState<ProductType[]>([]);
  // const customerId = customer?._id;
  console.log(customer?.wishlist);

  // useEffect(() => {
  //   const fetchWishlist = async () => {
  //     const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customer/${customerId}/wishlist`, {
  //       withCredentials: true,
  //     });
  //     setWishlist(res.data.wishlist);
  //   };

  //   fetchWishlist();
  // }, []);

  return (
    <div className="flex-1">
      <WishlistHeader count={customer?.wishlist.length ?? 0} />

      <div className="space-y-4">
        {customer && customer.wishlist.length > 0 ? (
          customer.wishlist.map((product) => (
            <WishlistItem key={product.id} {...product} />
          ))
        ) : (
          <p className="text-gray-500">Your wishlist is empty</p>
        )}
      </div>
    </div>
  );
}
