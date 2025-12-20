import RefundPolicy from '@/components/condition/RefundPolicy'
import Subbanner from '@/components/globals/Subbanner'
import MainTemplates from '@/templates/MainTemplates'
import React from 'react'

const page = () => {
  return (
    <>
    <MainTemplates>
      <Subbanner/>
      <RefundPolicy/>

    </MainTemplates>
    
    </>
  )
}

export default page