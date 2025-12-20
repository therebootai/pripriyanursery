
import CategoryPage from '@/components/category/CategoryPage'
import Subbanner from '@/components/globals/Subbanner'
import CategoryGrid from '@/components/category/CategoryGrid'
import MainTemplates from '@/templates/MainTemplates'
import React from 'react'

const page = () => {
  return (
    <>
    
      <MainTemplates>
        <Subbanner/>
         <section className='max-w-[1450px] mx-auto w-full px-4 py-10'>
         <CategoryGrid limit={7}/>
         </section>
         <CategoryPage/>

      </MainTemplates>
    
    </>
  )
}

export default page