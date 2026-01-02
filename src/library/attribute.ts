import axios from "axios";

export interface AttributeType {
    _id: string;
    attributeId: string;
    name: string;    
}

export async function getAttributesApi() {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/attribute`)

    if (!res.status) return [];    
    return res.data?.attributes || [];
  } catch (error) {
    console.error("Attribute fetch failed:", error);
    return [];
  }
}
