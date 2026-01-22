import MainTemplates from "@/templates/MainTemplates";
import ProductDetails from "@/components/product/ProductDetails";
import { ProductType } from "@/types/types";
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
        <div className="flex flex-col gap-4">
          <div className="grid md:grid-cols-4 gap-6">
            <h2 className="font-semibold text-[#0047BB] mb-6 text-[24px]">
              Related Products
            </h2>
            {/* {relatedProducts.map((item) => (
            <ProductCards
              key={item.href}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              category={item.category}
              href={item.href}
            />
          ))} */}
          </div>
        </div>
      </section>
    </MainTemplates>
  );
}
