import CategoryGrid from '@/components/category/CategoryGrid'
import Link from 'next/link'
import { fetchCategories } from '@/lib/api/category'

export default async function HomeCategory() {
  const categories = await fetchCategories()

  return (
    <section className="py-5">
      <div className="mx-auto max-w-[1300px] px-4">

        {/* HEADER ROW */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Shop by Categories
          </h2>

          <Link
            href="/categories"
            className="rounded-full bg-green-600 px-6 py-3 text-sm text-white hover:bg-green-700 transition"
          >
            Explore More Categories
          </Link>
        </div>

        {/* GRID */}
        <CategoryGrid
          data={categories}
          limit={12}
          cols={{ mobile: 2, sm: 3, md: 5, lg: 6, xl: 6 }}
        />

      </div>
    </section>
  )
}
