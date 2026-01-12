"use client";

import ProductCard from "@/components/ui/ProductCards";
import CategorySidebar from "./CategorySidebar";
import { ProductType } from "@/types/types";
import { useCategories } from "@/context/CategoryContext";
import { useMemo, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import CardSkeleton from "@/components/ui/CardSkeleton";
import { ListFilterPlus } from "lucide-react";

export default function CategoryPage({ activeCategory }: { activeCategory: string }) {
   const { categories } = useCategories();
  const [sortBy, setSortBy] = useState<
    "popularity" | "low-high" | "high-low" | "newest"
  >("popularity");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [page, setPage] = useState(1);
  const [displayProducts, setDisplayProducts] = useState<ProductType[]>([]);
   const [loading, setLoading] = useState(true);
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

    useEffect(() => {
      const fetchProducts = async () => {
        setLoading(true);

        try {
          const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/product`);

          if (activeCategory) {
            url.searchParams.append("category", activeCategory);
          }

          const res = await fetch(url.toString(), { cache: "no-store" });
          const data = await res.json();

          setProducts(data?.data || []);
        } catch {
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }, [activeCategory]);

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
    <section className="md:py-8 mx-auto max-w-300 md:px-8 flex flex-col md:gap-6">
      <div className="md:hidden flex justify-end items-center px-4 md:px-0">
        <div className="relative w-fit">
          {/* Icon */}
          <ListFilterPlus
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          {/* Select */}
          <select
            name="filter"
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="appearance-none rounded border border-gray-200 bg-white py-1 pl-9 pr-8 text-sm text-gray-600 outline-none focus:border-gray-400"
          >
            <option value="" hidden>
              Sort By
            </option>
            {sortArr.map((item) => (
              <option key={item.type} value={item.type}>
                {item.name}
              </option>
            ))}
          </select>

          {/* Dropdown arrow (optional, keeps it clean) */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            ▼
          </span>
        </div>
      </div>
      <div className="flex md:gap-4 justify-between items-start mb-4 p-2">
        {/* SIDEBAR */}
        <div className="md:w-[30%] w-[20%]">
          <CategorySidebar categories={categories} />
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full flex flex-col gap-2">
          <div className="hidden md:flex flex-wrap items-center gap-3 rounded bg-white p-4 shadow-sm">            
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

          <div className="grid grid-cols-2 gap-1 md:gap-4 md:grid-cols-3 lg:grid-cols-3">
            {sortedProducts.length > 0 ? (
              displayProducts.map((item) => (
                <ProductCard key={item._id} {...item} _id={item._id} />
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
    </section>
  );
}
