'use client'

import { productData } from '@/lib/productData'
import ProductCard from '@/components/ui/ProductCards'
import CategorySidebar from './CategorySidebar'
import CategoryHeader from './CategoryHeader'

export default function CategoryPage() {
  const allProducts = Object.values(productData).flat()

  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1300px] px-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">

          {/* LEFT SIDEBAR */}
          <CategorySidebar />

          {/* RIGHT CONTENT */}
          <div>
            <CategoryHeader />

            {/* PRODUCTS GRID */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allProducts.map((item) => (
                <ProductCard
                  key={`${item.category}-${item.id}`}
                  {...item}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
