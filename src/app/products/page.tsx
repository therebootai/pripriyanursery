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
    category?: string | string[];
    brand?: string | string[];
    attribute?: string | string[];
  }>;
}) => {

  const normalizeParam = (param?: string | string[]) => {
    if (!param) return [];
    if (Array.isArray(param)) {
      return param.map((p) => decodeURIComponent(p));
    }
    return [decodeURIComponent(param)];
  };


  const resolvedSearchParams = await searchParams;
const activeCategory = normalizeParam(resolvedSearchParams.category);
const activeBrand = normalizeParam(resolvedSearchParams.brand);
const activeAttribute = normalizeParam(resolvedSearchParams.attribute);


  const [categories, brands, attributes] = await Promise.allSettled([
    fetchCategories(),
    getBrandsApi(),
    getAttributesApi(),
  ]);

  const url = new URL("http://localhost:8000/api/product/");

activeCategory.forEach((c) => url.searchParams.append("category", c));

activeBrand.forEach((b) => url.searchParams.append("brand", b));

activeAttribute.forEach((a) => url.searchParams.append("attribute", a));


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
