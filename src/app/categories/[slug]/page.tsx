import Subbanner from "@/components/globals/Subbanner";
import MainTemplates from "@/templates/MainTemplates";
import CategoryPage from "@/components/category/CategoryPage";
import { fetchCategories } from "@/lib/api/category";

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const categories = await fetchCategories();
  const res = await fetch(
    `http://localhost:8000/api/product/?category=${decodeURIComponent(slug)}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  console.log(data);
  const products = data?.data || [];

  if (products.length === 0) {
    return (
      <MainTemplates>
        <h2 className="text-center text-red-500 py-20 text-xl">
          Product Not Found
        </h2>
      </MainTemplates>
    );
  }

  return (
    <MainTemplates>
      <Subbanner />
      <CategoryPage products={products} activeCategory={slug} categories={categories}/>
    </MainTemplates>
  );
};

export default page;
