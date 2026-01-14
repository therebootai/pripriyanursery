import CartList from '@/components/cart/CartList'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <>
    <Suspense fallback={<div>Loading..</div>}>

     <CartList/>  
     </Suspense>  
    </>
  )
}

export default page