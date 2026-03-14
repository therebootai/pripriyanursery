import MainTemplates from "@/templates/MainTemplates";
import ProductDetails from "@/components/product/ProductDetails";
import { ProductType } from "@/types/types";
import RelatedProductSection from "@/components/product/RelatedProductSection";
import { Metadata } from "next";
export const dynamic = "force-dynamic";

function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim(); // Trim whitespace
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("Product not found");

    const product = await res.json();

    return {
      title: product.name,
      description: stripHtmlTags(product.shortDescription),
      openGraph: {
        title: product.name,
        description: stripHtmlTags(product.shortDescription),
        images: [
          {
            url: product.coverImage.url,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: stripHtmlTags(product.shortDescription),
        images: [product.coverImage.url],
      },
    };
  } catch (error) {
    console.error("Metadata generation failed:", error);

    // Return fallback metadata if product fetch fails
    return {
      title: "Pripriya Nursery – Buy Indoor & Outdoor Plants Online",
      description:
        "Find the perfect indoor and outdoor plants at Pripriya Nursery.",
    };
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: ProductType | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("Product not found");

    const data = await res.json();
    console.log(data);
    product = data;
  } catch (error) {
    console.error("Product fetch failed:", error);
  }

  if (!product) {
    return (
      <MainTemplates>
        <h2 className="text-center text-red-500 py-20 text-xl">
          Product Not Found
        </h2>
      </MainTemplates>
    );
  }

  return (
    <MainTemplates>
      <section className="self-padding md:py-10  flex flex-col gap-8">
        <ProductDetails product={product} />
        <div className="w-full max-md:mb-6">
          <RelatedProductSection slug={product.slug} />
        </div>
      </section>
    </MainTemplates>
  );
}
