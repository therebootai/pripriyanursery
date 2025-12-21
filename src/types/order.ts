export type OrderItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  qty: number;
};

export type Order = {
  orderId: string;
  date: string;
  status: "Delivered" | "Processing" | "Cancelled";
  total: number;
  items: OrderItem[];
};
