import CategoryGrid from '@/components/category/CategoryGrid'
import Subbanner from '@/components/globals/Subbanner'
import MainTemplates from '@/templates/MainTemplates'
import { fetchCategories } from '@/lib/api/category'

export default async function CategoriesPage() {
  const categories = await fetchCategories()

  return (
    <MainTemplates>
      <Subbanner />

      <section className="py-6">
        <div className="mx-auto max-w-[1300px] px-4">
         

          <CategoryGrid
            data={categories}
            limit={12}
            cols={{ mobile: 2, sm: 3, md: 5, lg: 6, xl: 6 }}
          />
        </div>
      </section>
    </MainTemplates>
  )
}
