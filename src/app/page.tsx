import Homebanner from "@/components/home/Homebanner";
import ImageSection1 from "@/components/home/ImageSection1";
import HomeCategory from "@/components/home/HomeCategory";
import ProductSection from "@/components/product/ProductSection";
import Homebanner2 from "@/components/home/HomeBanner2";
import PlantsGallery from "@/components/home/PlantGallery";
import FeaturesSection from "@/components/home/FeaturesSection";
import MainTemplates from "@/templates/MainTemplates";
import VideoGallery from "@/components/home/VideoGallery";
export const dynamic = "force-dynamic";
const PRODUCT_LIMIT = 10;

export async function fetchProducts(query: string = "") {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product?limit=${PRODUCT_LIMIT}&status=Active&page=1&${query}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (err) {
    console.log(err);
    return { data: [], pagination: { totalPages: 0 } };
  }
}

export async function fetchCategoriesWithProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/category/with-products`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (err) {
    console.log(err);
    return { data: [], pagination: { totalPages: 0 } };
  }
}

export default async function Home() {
  const products = await fetchProducts();
  const newProducts = await fetchProducts("sort=-createdAt");
  const categoriesWithProducts = await fetchCategoriesWithProducts();
  const fruitPlantsroducts = await fetchProducts(
    `category=${categoriesWithProducts.categories[1].name}`,
  );
  const flowerPlantsroducts = await fetchProducts(
    `category=${categoriesWithProducts.categories[0].name}`,
  );
  const mangoPlantsroducts = await fetchProducts(`category=Mango Plant`);

  return (
    <>
      <MainTemplates>
        <Homebanner />
        <ImageSection1 />
        <HomeCategory
          title="Shop by Categories"
          limit={16}
          page={1}
          enableLazy={false}
        />
        <ProductSection
          title="Our Best Selling Mango Plants"
          products={mangoPlantsroducts.data}
          pagination={mangoPlantsroducts.pagination}
          limit={PRODUCT_LIMIT}
          apiQuery={`category=Mango Plant`}
          enableLazy={false}
        />
        <ProductSection
          title="Newest Product in this Month"
          products={newProducts.data}
          pagination={newProducts.pagination}
          limit={PRODUCT_LIMIT}
          apiQuery="sort=-createdAt"
          enableLazy={false}
        />
        <ProductSection
          title={categoriesWithProducts.categories[1].name}
          products={fruitPlantsroducts.data}
          pagination={fruitPlantsroducts.pagination}
          limit={PRODUCT_LIMIT}
          apiQuery={`category=${categoriesWithProducts.categories[1].name}`}
          enableLazy={false}
        />

        <Homebanner2 />
        <ProductSection
          title={categoriesWithProducts.categories[0].name}
          products={flowerPlantsroducts.data}
          pagination={flowerPlantsroducts.pagination}
          limit={PRODUCT_LIMIT}
          apiQuery={`category=${categoriesWithProducts.categories[0].name}`}
          enableLazy={false}
        />
        <VideoGallery/>
        <HomeCategory
          title="Trending Plants"
          limit={6}
          page={2}
          enableLazy={false}
        />

        <PlantsGallery />
        <FeaturesSection />
      </MainTemplates>
    </>
  );
}
