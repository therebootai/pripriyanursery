import RefundPolicy from '@/components/condition/RefundPolicy'
import Subbanner from '@/components/globals/Subbanner'
import MainTemplates from '@/templates/MainTemplates'
import React from 'react'
export const dynamic = 'force-dynamic'; 
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