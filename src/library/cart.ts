import axios from "axios";

export const addToCartApi = async (
  customerId: string,
  productId: string,
  variantId?: string,
  quantity = 1,
  priceAtTime?: number
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/customer/${customerId}/cart`,
    { productId, variantId, quantity, priceAtTime },
    { withCredentials: true }
  );

  return res.data;
};

export const removeFromCartApi = async (
  customerId: string,
  productId: string,
  variantId?: string
) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/customer/${customerId}/cart`,
    {
      data: { productId, variantId },
      withCredentials: true,
    }
  );

  return res.data;
};
