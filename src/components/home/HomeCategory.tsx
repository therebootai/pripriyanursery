"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Image from "next/image";
import CardSkeleton from "../ui/CardSkeleton";
import { useCategoryList } from "@/hooks/useCategoryList";
import { useInView } from "react-intersection-observer";

interface HomeCategoryProps {
  title?: string;
  limit?: number;
  page?: number;
  enableLazy?: boolean;
}

export default function HomeCategory({
  title = "Shop by Categories",
  limit = 16,
  enableLazy = false,
  page = 1,
}: HomeCategoryProps) {
  const pathname = usePathname();
  const isCategoryPage = pathname === "/categories";

  const { categories, loading, loadingMore, hasMore, loadMore } =
    useCategoryList({
      initialLimit: limit,
      initialPage: page,
      isInfinite: enableLazy || isCategoryPage,
    });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && hasMore && !loading && !loadingMore) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadingMore, loadMore]);

  if (loading) {
    return (
      <div className="py-5">
        <div className="self-padding ">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-2 md:py-5">
      <div className="self-padding ">
        {!isCategoryPage && (
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-sm md:text-2xl font-bold">{title}</h2>

            <Link
              href="/categories"
              className="text-xs rounded-full bg-green-600 py-1 px-2 md:px-6 md:py-3 md:text-sm text-white hover:bg-green-700 transition"
            >
              Explore More
            </Link>
          </div>
        )}

        <div className="grid gap-3 md:gap-4 grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-7 xxl:grid-cols-8 place-items-stretch justify-items-stretch">
          {categories.map((cat, index) => (
            <React.Fragment key={`${cat.parent.id}-${index}`}>
              <Link
                href={`/products?category=${encodeURIComponent(cat.parent.name)}`}
                className="text-center group"
              >
                <div className="relative mx-auto size-[5rem] min-[410px]:size-[7.5rem] md:size-[6rem] lg:size-[8rem] overflow-hidden rounded-md bg-gray-300">
                  <Image
                    src={cat.parent.image}
                    alt={cat.parent.name}
                    fill
                    className="object-cover group-hover:scale-110 transition"
                  />
                </div>

                <p className=" mt-2 lg:mt-4 text-gray-900 font-medium text-xs sm:text-sm lg:text-sm">
                  {cat.parent.name}
                </p>
              </Link>

              {cat.subCategories.map((subCat) => (
                <Link
                  key={subCat.id ?? subCat.name}
                  href={`/products?category=${encodeURIComponent(subCat.name)}`}
                  className="text-center group"
                >
                  <div className="relative mx-auto size-[5rem] min-[410px]:size-[7.5rem] md:size-[6rem] lg:size-[8rem]  overflow-hidden rounded-md bg-gray-300">
                    <Image
                      src={subCat.image}
                      alt={subCat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition"
                    />
                  </div>

                  <p className="mt-2 lg:mt-4 text-gray-900 font-medium text-xs sm:text-sm lg:text-sm">
                    {subCat.name}
                  </p>
                </Link>
              ))}
            </React.Fragment>
          ))}

          {loadingMore && (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          )}
        </div>

        {(enableLazy || isCategoryPage) && hasMore && (
          <div
            ref={ref}
            className="w-full h-10 mt-4 flex justify-center items-center"
          ></div>
        )}

        {(enableLazy || isCategoryPage) &&
          !hasMore &&
          categories.length > 0 && (
            <p className="text-center text-gray-400 text-sm mt-8"></p>
          )}
      </div>
    </section>
  );
}
