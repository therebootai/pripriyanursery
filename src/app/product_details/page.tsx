import Productdetailspage from '@/components/product/Productdetailspage'
import MainTemplates from '@/templates/MainTemplates'
import React from 'react'
import ProductDetail from '@/components/product/DetailsProduct'
import ProductSection from "@/components/product/ProductSection";
import { productData } from "@/lib/productData";

const page = () => {
  return (
    <>
    
       <MainTemplates>

          {/* <Productdetailspage/> */}
          <ProductDetail/>

           
           <ProductSection
             title="Related Product"
             products={productData.newest}
             rows={1}
           />
       </MainTemplates>
    
    
    </>
  )
}

export default page