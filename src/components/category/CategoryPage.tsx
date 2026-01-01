"use client";

import ProductCard from "@/components/ui/ProductCards";
import CategorySidebar from "./CategorySidebar";
import CategoryHeader from "./CategoryHeader";
import { ProductType } from "../product/ProductSection";
import { CategoryUI } from "@/lib/api/category";

export default function CategoryPage({
  products,
  activeCategory,
  categories,
}: {
  products: ProductType[];
  activeCategory: string;
  categories: CategoryUI[];
}) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1300px] px-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          {/* LEFT SIDEBAR */}
          <CategorySidebar activeCategory={activeCategory} categories={categories}/>

          {/* RIGHT CONTENT */}
          <div>
            <CategoryHeader category={activeCategory} />

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.length > 0 ? (
                products.map((item) => <ProductCard key={item._id} {...item} />)
              ) : (
                <p className="text-center py-20 text-gray-500">
                  No products found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
