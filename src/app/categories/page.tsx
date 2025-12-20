import CategoryGrid from '@/components/category/CategoryGrid'
import Subbanner from '@/components/globals/Subbanner'
import MainTemplates from '@/templates/MainTemplates'

export default function CategoriesPage() {
  return (
   <>
   
   <MainTemplates>

    <Subbanner/>

    <section className="py-6">
      <div className="mx-auto max-w-[1300px] px-4">
        <h1 className="mb-10 text-3xl font-bold">
          All Categories
        </h1>

      <CategoryGrid 
  limit={12} 
  cols={{ mobile: 2, sm: 3, md: 4, lg: 6, xl: 6 }} 
/>

    
      </div>
    </section>

   </MainTemplates>
   </>
  )
}
