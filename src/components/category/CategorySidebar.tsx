"use client";

import { CategoryUI } from "@/lib/api/category";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CategorySidebar({
  activeCategory,
  categories,
}: {
  activeCategory?: string;
  categories: CategoryUI[];
}) {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    router.push(`/categories/${encodeURIComponent(category)}`);
  };

  return (
    <aside className="sticky top-24 space-y-4">
      <FilterBox title="Choose Category">
        {categories.map((item) => (
          <label
            key={item.name}
            className="flex items-center gap-2 text-sm cursor-pointer"
            onClick={() => handleCategoryClick(item.name)}
          >
            <input
              type="checkbox"
              checked={decodeURIComponent(activeCategory || "") === item.name}
              readOnly
            />
            {item.name}
          </label>
        ))}
      </FilterBox>

      <div className="h-[360px]">
        <Image
          src="/assets/home/category/plant2.png"
          alt="img"
          height={100}
          width={300}
          className="h-full"
        />
      </div>
    </aside>
  );
}

function FilterBox({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden  bg-white">
      {/* 🔥 TITLE AREA */}
      <button
        className="
          flex w-full items-center justify-between
          bg-[#DAFFE4] px-4 py-3
          text-sm font-semibold text-black
        "
      >
        {title}
        <ChevronDown size={16} />
      </button>

      {/* CONTENT */}
      {children && (
        <div className="space-y-5 px-4 py-4 text-gray-700">{children}</div>
      )}
    </div>
  );
}
