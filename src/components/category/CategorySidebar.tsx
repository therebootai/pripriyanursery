"use client";

import { CategoryUI } from "@/library/category";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategorySidebar({
  categories,
}: {
  categories: CategoryUI[] | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const handleClick = (name: string) => {
    router.push(`/products?category=${encodeURIComponent(name)}`);
  };

  return (
    <aside className="sticky top-24 h-[calc(100vh-6rem)] overflow-hidden">
      <div className="h-full overflow-y-auto pr-2 custom-scroll flex flex-col gap-1 md:gap-3">
        {categories?.map((group) => (
          <div key={group.parent.id} className="">
            {/* Parent Category */}
            <button
              onClick={() => handleClick(group.parent.name)}
              className={`w-full lg:w-full flex flex-col lg:flex-row max-md:justify-center items-center md:gap-3 gap-1 rounded-md p-1 text-left
              ${
                activeCategory === group.parent.name
                  ? "bg-defined-green/30"
                  : "hover:bg-gray-100"
              }
            `}
            >
              <div className="relative size-12 md:size-12 xl:size-14 xxl:size-16 shrink-0">
                <Image
                  src={group.parent.image}
                  alt={group.parent.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <span className="text-xs md:text-sm text-center md:text-left md:font-semibold text-gray-800">
                {group.parent.name}
              </span>
            </button>

            {/* Subcategories */}
            <div className=" ">
              {group.subCategories.map((sub) => (
                <button
                  key={sub.id ?? sub.name}
                  onClick={() => handleClick(sub.name)}
                  className={`w-full lg:w-full flex flex-col lg:flex-row  items-center md:gap-3 gap-1 rounded-md p-2
                  ${
                    activeCategory === sub.name
                      ? "bg-defined-green/10"
                      : "hover:bg-gray-100"
                  }
                `}
                >
                  <div className="relative size-12 md:size-12 xl:size-14 xxl:size-16 shrink-0">
                    <Image
                      src={sub.image}
                      alt={sub.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <span className="text-xs md:text-sm text-center md:text-left md:font-semibold text-gray-700">
                    {sub.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
