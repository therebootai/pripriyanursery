import Homebanner from "@/components/home/Homebanner";
import ImageSection1 from "@/components/home/ImageSection1";
import HomeCategory from "@/components/home/HomeCategory";
// import NewestProducts from "@/components/product/NewestProducts";
import ProductSection from "@/components/product/ProductSection";
// import { productData } from "@/lib/productData";
import Homebanner2 from "@/components/home/HomeBanner2";
import PlantsGallery from "@/components/home/PlantGallery";
import FeaturesSection from "@/components/home/FeaturesSection";
import MainTemplates from "@/templates/MainTemplates";

export async function fetchProducts() {  
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product`,
      { cache: "no-store" } // or revalidate
    );

    if (!res.ok) throw new Error("Failed to fetch");
    // console.log((await res.json()).data);
    return res.json();
  } catch (err) {
    console.log(err);
    return [];
  }
}


export default async function Home() {
  const products = await fetchProducts();
  return (
    <>
      <MainTemplates>
        <Homebanner />
        <ImageSection1 />
        <HomeCategory />

        <ProductSection
          title="Newest Product in this Month"
          products={products.data}
          pagination={products.pagination}
          rows={2}
        />

        {/* <ProductSection
          title="Indoor Plants"
          products={productData.indoor}
          rows={1}
        />

        <ProductSection
          title="Outdoor"
          products={productData.outdoor}
          rows={1}
        />

        <ProductSection title="Mango" products={productData.mango} rows={1} />

        <ProductSection title="Fruit" products={productData.fruit} rows={1} /> */}

        <Homebanner2 />

        <PlantsGallery />
        <FeaturesSection />
      </MainTemplates>
    </>
  );
}
