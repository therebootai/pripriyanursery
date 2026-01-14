import ReviewPage from '@/components/review/Review'
import MainTemplates from '@/templates/MainTemplates'
import React from 'react'
export const dynamic = 'force-dynamic'; 
const page = () => {
  return (
    <>
     <MainTemplates>

       <ReviewPage/>

     </MainTemplates>
    </>
  )
}

export default page