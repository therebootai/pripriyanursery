"use client";

import ProductCard from "@/components/ui/ProductCards";
import CategorySidebar from "./CategorySidebar";
import CategoryHeader from "./CategoryHeader";
import { ProductType } from "../product/ProductSection";
import { CategoryUI } from "@/lib/api/category";
import { BrandType } from "@/library/brand";
import { AttributeType } from "@/library/attribute";

export default function CategoryPage({
  products,
  activeCategory,
  activeBrand,
  activeAttribute,
  categories,
  brands,
  attributes,
}: {
  products: ProductType[];
  activeCategory: string | null;
  activeBrand: string | null;
  activeAttribute : string | null;
  categories: CategoryUI[];
  brands: BrandType[];
  attributes: AttributeType[]
}) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1300px] px-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          {/* LEFT SIDEBAR */}
          <CategorySidebar            
            categories={categories}
            brands={brands}
            attributes={attributes}
          />

          {/* RIGHT CONTENT */}
          <div>
            <CategoryHeader category={activeCategory} brand={activeBrand} attribute={activeAttribute} />

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.length > 0 ? (
                products.map((item) => <ProductCard key={item._id} {...item} />)
              ) : (
                <p className="text-center py-20 text-gray-500 w-full">
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
