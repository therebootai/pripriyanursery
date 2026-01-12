import Homebanner from "@/components/home/Homebanner";
import ImageSection1 from "@/components/home/ImageSection1";
import HomeCategory from "@/components/home/HomeCategory";
import ProductSection from "@/components/product/ProductSection";
import Homebanner2 from "@/components/home/HomeBanner2";
import PlantsGallery from "@/components/home/PlantGallery";
import FeaturesSection from "@/components/home/FeaturesSection";
import MainTemplates from "@/templates/MainTemplates";

export async function fetchProducts() {  
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product?limit=10`,
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
        />       

        <Homebanner2 />

        <PlantsGallery />
        <FeaturesSection />
      </MainTemplates>
    </>
  );
}
