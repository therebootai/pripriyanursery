import Subbanner from "@/components/globals/Subbanner";
import MainTemplates from "@/templates/MainTemplates";
import CategoryPage from "@/components/category/CategoryPage";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
  }>;
}) => {
  const { category } = await searchParams;

  return (
    <MainTemplates>
      <Subbanner />
      <CategoryPage activeCategory={category || ""} />
    </MainTemplates>
  );
};

export default page;
