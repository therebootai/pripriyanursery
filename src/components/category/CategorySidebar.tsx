"use client";

import { CategoryUI } from "@/lib/api/category";
import { AttributeType } from "@/library/attribute";
import { BrandType } from "@/library/brand";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CategorySidebar({  
  categories,
  brands,
  attributes
}: {  
  categories: CategoryUI[];
  brands: BrandType[];
  attributes: AttributeType[]
}) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [openCategory, setOpenCategory] = useState(true);
  const [openBrand, setOpenBrand] = useState(true);
  const [openAttribute, setOpenAttribute] = useState(true);

  const activeCategory = searchParams.get("category");
  const activeBrand = searchParams.get("brand");
  const activeAttribute = searchParams.get("attribute");

  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };
  const handleBrand = (name: string) => {
    router.push(
      `/products?brand=${encodeURIComponent(name)}`
    );
  };
  const handleAttribute = (name: string) => {
    router.push(`/products?attribute=${encodeURIComponent(name)}`);
  };

  return (
    <aside className="sticky top-24 space-y-4">
      <FilterBox
        title="Choose Category"
        open={openCategory}
        onToggle={() => setOpenCategory(!openCategory)}
      >
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
      <FilterBox
        title="Choose Brand"
        open={openBrand}
        onToggle={() => setOpenBrand(!openBrand)}
      >
        {brands?.map((b) => (
          <label
            key={b.name}
            className="flex items-center gap-2 text-sm cursor-pointer"
            onClick={() => handleBrand(b.name)}
          >
            <input type="checkbox" checked={activeBrand === b.name} readOnly />
            {b.name}
          </label>
        ))}
      </FilterBox>
      <FilterBox
        title="Choose Attribute"
        open={openAttribute}
        onToggle={() => setOpenAttribute(!openAttribute)}
      >
        {attributes?.map((a) => (
          <label
            key={a.name}
            className="flex items-center gap-2 text-sm cursor-pointer"
            onClick={() => handleAttribute(a.name)}
          >
            <input
              type="checkbox"
              checked={activeAttribute === a.name}
              readOnly
            />
            {a.name}
          </label>
        ))}
      </FilterBox>
      <div className="h-90">
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

function FilterBox({ title, open, onToggle, children } : {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className={`
          flex w-full items-center justify-between
          px-4 py-3 text-sm font-semibold
          ${open ? "bg-defined-green text-white" : "bg-[#DAFFE4]"}
        `}
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="space-y-5 px-4 py-4 text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

