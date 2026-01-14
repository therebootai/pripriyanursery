import Productdetailspage from '@/components/product/Productdetailspage'
import MainTemplates from '@/templates/MainTemplates'
import React from 'react'
import ProductDetail from '@/components/product/DetailsProduct'
import ProductSection from "@/components/product/ProductSection";
export const dynamic = 'force-dynamic'; 
const page = () => {
  return (
    <>
    
       <MainTemplates>

          {/* <Productdetailspage/> */}
          <ProductDetail/>

           
           {/* <ProductSection
             title="Related Product"
             
           /> */}
       </MainTemplates>
    
    
    </>
  )
}

export default page