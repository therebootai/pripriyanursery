import axios from "axios";

export interface BrandType {
    _id: string;
    brandId: string;
    name: string;
    image: string;
}

export async function getBrandsApi() {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/brand`)

    if (!res.status) return [];    
    return res.data?.brands || [];
  } catch (error) {
    console.error("Brand fetch failed:", error);
    return [];
  }
}
