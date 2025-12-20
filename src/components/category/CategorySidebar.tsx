'use client'

import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

export default function CategorySidebar() {
  return (
    <aside className="sticky top-24 space-y-4">

      {/* Choose Brand */}
      <FilterBox title="Choose Brand" />

      {/* Choose Category */}
      <FilterBox title="Choose Category">
        {[
          'Outdoor Plants',
          'Indoor Plants',
          'Flowering Plants',
          'Succulents & Cacti',
          'Herbs & Edible Plants',
          'Seeds',
          'Pots & Planters',
          'Soil & Fertilizers',
        ].map((item, i) => (
          <label key={i} className="flex items-center gap-2 text-sm">
            <input type="checkbox" />
            {item}
          </label>
        ))}
      </FilterBox>

      {/* Discount */}
      <FilterBox title="Discount">
        {['20% or more', '20% or more','15% or more', '10% or more'].map((item) => (
          <label key={item} className="flex items-center gap-2 text-sm">
            <input type="checkbox" />
            {item}
          </label>
        ))}
      </FilterBox>

      {/* Ratings */}
      <FilterBox title="Customer Ratings">
        {[ '4.5 & above', '3.0 & above', '2.5 & above'].map((item) => (
          <label key={item} className="flex items-center gap-2 text-sm">
             <input type="checkbox" />
            ⭐ {item}
          </label>
        ))}
      </FilterBox>

      <div className=' h-[360px]'>
        <Image src='/assets/home/category/plant2.png' alt='img' height={100} width={300} className='h-full'/>
      </div>

    </aside>
  )
}

function FilterBox({
  title,
  children,
}: {
  title: string
  children?: React.ReactNode
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
        <div className="space-y-5 px-4 py-4 text-gray-700">
          {children}
        </div>
      )}
    </div>
  )
}

