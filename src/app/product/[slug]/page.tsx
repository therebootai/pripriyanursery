import { productData } from "@/lib/productData";
import MainTemplates from "@/templates/MainTemplates";
import ProductDetails from "@/components/product/ProductDetails";
import ProductCards from "@/components/ui/ProductCards";

// 🔥 Flatten all products correctly
const allProducts = Object.values(productData).flatMap((category) => category);

type PageProps = {
  params:Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } =await params;

  const product = allProducts.find((p) => p.href === slug);

  if (!product) {
    return (
      <MainTemplates>
        <h2 className="text-center text-red-500 py-20 text-xl">
          Product Not Found
        </h2>
      </MainTemplates>
    );
  }

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.href !== product.href)
    .slice(0, 4);

  return (
    <MainTemplates>
      <ProductDetails product={product} />

      <div className="max-w-[1300px] mx-auto px-4 py-10">
        <h2 className="font-semibold text-[#0047BB] mb-6 text-[24px]">Related Products</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <ProductCards
              key={item.href}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              category={item.category}
              href={item.href}
            />
          ))}
        </div>
      </div>
    </MainTemplates>

  );
}

/* Required for static export */
export function generateStaticParams() {
  return allProducts.map((product) => ({
    slug: product.href,
  }));
}
