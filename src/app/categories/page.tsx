import Subbanner from '@/components/globals/Subbanner'
import MainTemplates from '@/templates/MainTemplates'
import { fetchCategories } from '@/library/category'
import HomeCategory from '@/components/home/HomeCategory'

export default async function CategoriesPage() {
  // const categories = await fetchCategories()

  return (
    <MainTemplates>
      <Subbanner />

      <section className="py-6">
        <div className="mx-auto max-w-[1200px] px-4">
          <HomeCategory />
        </div>
      </section>
    </MainTemplates>
  );
}
