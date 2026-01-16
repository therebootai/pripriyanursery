"use client";
import Link from "next/link";
import { useCategories } from "@/context/CategoryContext";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import CardSkeleton from "../ui/CardSkeleton";

export default function HomeCategory() {
const {categories, loading} = useCategories();
  const pathname = usePathname();

  if(loading){
    return (
      <div className="py-5">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-8">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <div/>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-2 md:py-5">
      <div className="mx-auto max-w-[1200px] px-4 lg:px-8">
        {/* HEADER ROW */}

        {pathname !== "/categories" && (
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-sm md:text-2xl font-bold">
              Shop by Categories
            </h2>

            <Link
              href="/categories"
              className="text-xs rounded-full bg-green-600 py-1 px-2 md:px-6 md:py-3 md:text-sm text-white hover:bg-green-700 transition"
            >
              Explore More
            </Link>
          </div>
        )}
       
        {/* GRID */}
        <div className="grid gap-4 grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-7">
          {categories?.map((cat) => (
            <React.Fragment key={cat.parent.id}>
              {/* Parent card */}
              <Link
                href={`/products?category=${cat.parent.name}`}
                className="text-center group"
              >
                <div className="relative mx-auto h-[90px] w-[90px] sm:h-[140px] sm:w-[140px] lg:size-[8rem] overflow-hidden rounded-md bg-gray-300">
                  <Image
                    src={cat.parent.image}
                    alt={cat.parent.name}
                    fill
                    className="object-cover group-hover:scale-110 transition"
                  />
                </div>

                <p className="mt-4 text-gray-900 font-medium text-xs sm:text-sm lg:text-sm">
                  {cat.parent.name}
                </p>
              </Link>

              {cat.subCategories.map((subCat) => (
                <Link
                  key={subCat.id ?? subCat.name}
                  href={`/products?category=${subCat.name}`}
                  className="text-center group"
                >
                  <div className="relative mx-auto h-[90px] w-[90px] sm:h-[140px] sm:w-[140px] lg:size-[8rem]  overflow-hidden rounded-md bg-gray-300">
                    <Image
                      src={subCat.image}
                      alt={subCat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition"
                    />
                  </div>

                  <p className="mt-4 text-gray-900 font-medium text-xs sm:text-sm lg:text-sm">
                    {subCat.name}
                  </p>
                </Link>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
