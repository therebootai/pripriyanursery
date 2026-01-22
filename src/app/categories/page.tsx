import Subbanner from '@/components/globals/Subbanner'
import MainTemplates from '@/templates/MainTemplates'
import { fetchCategories } from '@/library/category'
import HomeCategory from '@/components/home/HomeCategory'
import { Suspense } from 'react';
export const dynamic = 'force-dynamic'; 

export default async function CategoriesPage() {
  // const categories = await fetchCategories()

  return (
    <MainTemplates>
      <Subbanner />
      <Suspense fallback={<div>loading...</div>}>

      <section className="py-6">
        <div className=" self-padding">
          <HomeCategory  limit={8} 
          enableLazy={true}  />
        </div>
      </section>
      </Suspense>
    </MainTemplates>
  );
}
