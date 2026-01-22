import ReviewPage from "@/components/review/Review";
import MainTemplates from "@/templates/MainTemplates";
import { ProductType } from "@/types/types";
import React from "react";
export const dynamic = "force-dynamic";
const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    product?: string;
  }>;
}) => {
  const { product } = await searchParams;
  let productDetails: ProductType | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/${product}`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("Product not found");

    const data = await res.json();
    productDetails = data;
  } catch (error) {
    console.error("Product fetch failed:", error);
  }

  return (
    <>
      <MainTemplates>
        <ReviewPage productDetails={productDetails} />
      </MainTemplates>
    </>
  );
};

export default page;
