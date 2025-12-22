import CheckoutClient from '@/components/checkout/CheckoutClient'
import MainTemplates from '@/templates/MainTemplates'
import React from 'react'

const page = () => {
  return (
    <>
          <MainTemplates>

            <CheckoutClient/>
          </MainTemplates>

    </>
  )
}

export default page