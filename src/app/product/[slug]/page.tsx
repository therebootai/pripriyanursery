import MainTemplates from "@/templates/MainTemplates";
import ProductDetails from "@/components/product/ProductDetails";
import { ProductType } from "@/types/types";
import RelatedProductSection from "@/components/product/RelatedProductSection";
export const dynamic = 'force-dynamic'; 

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
 

  const {slug} = await params;
  let product: ProductType | null = null;
  
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) throw new Error('Product not found');
    
    const data = await res.json();
    product = data; 
  } catch (error) {
    console.error('Product fetch failed:', error);
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

  // const relatedProducts = allProducts
  //   .filter((p) => p.category === product.category && p.href !== product.href)
  //   .slice(0, 4);

  return (
    <MainTemplates>
      <section className="self-padding md:py-10  flex flex-col gap-8">
        <ProductDetails product={product} />
        <div className="w-full max-md:mb-6">
          <RelatedProductSection slug={product.slug}/>
           
        </div>
      </section>
    </MainTemplates>
  );
}
