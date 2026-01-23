import Subbanner from "@/components/globals/Subbanner";
import MainTemplates from "@/templates/MainTemplates";
import CategoryPage from "@/components/category/CategoryPage";
export const dynamic = "force-dynamic";
const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    attribute?: string;
  }>;
}) => {
  const { category, brand, attribute } = await searchParams;

  return (
    <MainTemplates>
      <Subbanner />
      <CategoryPage
        activeCategory={category || ""}
        activeBrand={brand || ""}
        activeAttribute={attribute || ""}
      />
    </MainTemplates>
  );
};

export default page;
