import Subbanner from "@/components/globals/Subbanner";
import MainTemplates from "@/templates/MainTemplates";
import CategoryPage from "@/components/category/CategoryPage";
import { fetchCategories } from "@/lib/api/category";
import { getBrandsApi } from "@/library/brand";
import { getAttributesApi } from "@/library/attribute";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    attribute?: string;
  }>;
}) => {
     const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams.category
    ? decodeURIComponent(resolvedSearchParams.category)
    : null;

  const activeBrand = resolvedSearchParams.brand
    ? decodeURIComponent(resolvedSearchParams.brand)
    : null;

  const activeAttribute = resolvedSearchParams.attribute
    ? decodeURIComponent(resolvedSearchParams.attribute)
    : null;

  const [categories, brands, attributes] = await Promise.allSettled([
    fetchCategories(),
    getBrandsApi(),
    getAttributesApi(),
  ]);

  const url = new URL("http://localhost:8000/api/product/");

  if (activeCategory) url.searchParams.set("category", activeCategory);
  if (activeBrand) url.searchParams.set("brand", activeBrand);
  if (activeAttribute) url.searchParams.set("attribute", activeAttribute);

  let products = [];

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      products = data?.data || [];
    }
  } catch {
    products = [];
  }

  return (
    <MainTemplates>
      <Subbanner />
      <CategoryPage
        products={products}
        activeCategory={activeCategory}
        activeBrand={activeBrand}
        activeAttribute={activeAttribute}
        categories={categories.status === "fulfilled" ? categories.value : []}
        brands={brands.status === "fulfilled" ? brands.value : []}
        attributes={attributes.status === "fulfilled" ? attributes.value : []}
      />
    </MainTemplates>
  );
};

export default page;
