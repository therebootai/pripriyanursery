import axios from "axios";

export interface BrandType {
  _id: string;
  brandId: string;
  name: string;
  image: string;
}

export async function getBrandsApi() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data?.brands || [];
  } catch (error) {
    console.error("Brand fetch failed:", error);
    return [];
  }
}
