export type CartItemType = {
  id: number;
  name: string;
  price?: number;
  image: string;
  category?: string;
  tag?: string;
  slug: string;
  qty: number;
};

const CART_KEY = "cart";

/* =======================
   Get Cart (SSR Safe)
======================= */
export const getCart = (): CartItemType[] => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse cart:", error);
    return [];
  }
};

/* =======================
   Save Cart (Safety)
======================= */
export const saveCart = (cart: CartItemType[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

/* =======================
   Add to Cart
======================= */
export const addToCart = (product: CartItemType) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: product.qty || 1 });
  }

  saveCart(cart);
};

/* =======================
   Update Quantity
======================= */
export const updateQty = (id: number, qty: number) => {
  if (qty < 1) return;

  const updated = getCart()
    .map((item) =>
      item.id === id ? { ...item, qty } : item
    )
    .filter((item) => item.qty > 0);

  saveCart(updated);
};

/* =======================
   Remove Item
======================= */
export const removeItem = (id: number) => {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
};
