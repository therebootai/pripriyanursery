import axios from "axios";

export const toggleWishlistApi = async (customerId?: string, productId?: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/customer/${customerId}/wishlist`,
    { productId },
    { withCredentials: true }
  );
  return res.data; // { message, wishlist }
};


export const removeWishlistApi = (customerId: string, productId: string) => {
  return axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/customer/remove-wishlist/${customerId}/${productId}`,  { withCredentials: true });
};