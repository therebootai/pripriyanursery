import { Order } from "@/types/order";

export const addOrder = (order: Order) => {
  const existing: Order[] = JSON.parse(
    localStorage.getItem("orders") || "[]"
  );

  localStorage.setItem(
    "orders",
    JSON.stringify([order, ...existing])
  );
};
