import axios from "axios";

export const toggleWishlistApi = async (customerId?: string, productId?: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/customer/${customerId}/wishlist`,
    { productId },
    { withCredentials: true }
  );
  console.log(res.data);
  return res.data; // { message, wishlist }
};
