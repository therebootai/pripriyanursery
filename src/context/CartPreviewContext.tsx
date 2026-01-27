"use client";

import { createContext, useContext, useState } from "react";

type CartPreviewProduct = {
  _id: string;
  name: string;
  price: number;
  mrp?: number;
  discount?: number;
  image: string;
};

type CartPreviewContextType = {
  product: CartPreviewProduct | null;
  show: boolean;
  showPreview: (product: CartPreviewProduct) => void;
  hidePreview: () => void;
};

const CartPreviewContext = createContext<CartPreviewContextType | null>(null);

export const CartPreviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [product, setProduct] = useState<CartPreviewProduct | null>(null);
  const [show, setShow] = useState(false);

  const showPreview = (product: CartPreviewProduct) => {
    setProduct(product);
    setShow(true);

    // auto hide after 4 sec
    setTimeout(() => setShow(false), 10000);
  };

  const hidePreview = () => setShow(false);

  return (
    <CartPreviewContext.Provider value={{ product, show, showPreview, hidePreview }}>
      {children}
    </CartPreviewContext.Provider>
  );
};

export const useCartPreview = () => {
  const ctx = useContext(CartPreviewContext);
  if (!ctx) throw new Error("useCartPreview must be used inside provider");
  return ctx;
};
