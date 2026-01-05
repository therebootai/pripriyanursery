"use client";

import ProductCard from "@/components/ui/ProductCards";
import CategorySidebar from "./CategorySidebar";
import { ProductType } from "../product/ProductSection";
import { CategoryUI } from "@/lib/api/category";
import { BrandType } from "@/library/brand";
import { AttributeType } from "@/library/attribute";
import { useMemo, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import CardSkeleton from "@/components/ui/CardSkeleton";

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
  activeCategory: string[];
  activeBrand: string[];
  activeAttribute: string[];
  categories: CategoryUI[];
  brands: BrandType[];
  attributes: AttributeType[];
}) {
  const [sortBy, setSortBy] = useState<
    "popularity" | "low-high" | "high-low" | "newest"
  >("popularity");

  const [page, setPage] = useState(1);
  const [displayProducts, setDisplayProducts] = useState<ProductType[]>([]);
  const { ref, inView } = useInView({ threshold: 0.1 });
  const LIMIT = 10;



  const sortArr = [
    {
      name: "Popularity",
      type: "popularity",
    },
    {
      name: "Price : Low to High",
      type: "low-high",
    },
    {
      name: "Price : High to Low",
      type: "high-low",
    },
    {
      name: "Newest First",
      type: "newest",
    },
  ];

  const sortedProducts = useMemo(() => {
    const items = [...products];


    switch (sortBy) {
      case "low-high":
        return items.sort((a, b) => a.price - b.price);

      case "high-low":
        return items.sort((a, b) => b.price - a.price);

      case "newest":
        return items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "popularity":
      default:
        return items.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }
  }, [products, sortBy]);

  const sortBtnClass = (type: string) =>
    `rounded-full px-4 py-1 text-xs transition ${
      sortBy === type
        ? "bg-green-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  useEffect(() => {
    setDisplayProducts(sortedProducts.slice(0, LIMIT));
    setPage(1);
  }, [sortedProducts]);

  const loadMore = () => {
    const nextPage = page + 1;
    const nextItems = sortedProducts.slice(page * LIMIT, nextPage * LIMIT);

    if (nextItems.length === 0) return;

    setDisplayProducts((prev) => [...prev, ...nextItems]);
    setPage(nextPage);
  };

  useEffect(() => {
    if (inView) loadMore();
  }, [inView]);

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
            <div className="rounded bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Home <span className="mx-1">›</span> {activeCategory.join(", ")}{" "}
                {">"} {activeBrand.join(", ")} {">"}{" "}
                {activeAttribute.join(", ")}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-600">Sort By</span>

                {sortArr.map((item) => (
                  <button
                    key={item.type}
                    className={sortBtnClass(item.type)}
                    onClick={() => setSortBy(item.type as typeof sortBy)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.length > 0 ? (
                displayProducts.map((item) => (
                  <ProductCard key={item._id} {...item} id={item._id} />
                ))
              ) : (
                <p className="text-center py-20 text-gray-500 w-full">
                  No products found
                </p>
              )}
            </div>
            {displayProducts.length < sortedProducts.length && (
              <div
                ref={ref}
                className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
