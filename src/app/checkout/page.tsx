import CheckoutClient from '@/components/checkout/CheckoutClient'
import MainTemplates from '@/templates/MainTemplates'
import React, { Suspense } from 'react'
export const dynamic = 'force-dynamic'; 

const page = () => {
  return (
    <>
          <MainTemplates>
            <Suspense fallback={<div>Loading...</div>}>
            <CheckoutClient/>
            </Suspense>
          </MainTemplates>

    </>
  )
}

export default page