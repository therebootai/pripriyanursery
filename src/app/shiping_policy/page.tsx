import ShipingPolicy from '@/components/condition/ShipingPolicy'
import Subbanner from '@/components/globals/Subbanner'
import MainTemplates from '@/templates/MainTemplates'
import React from 'react'
export const dynamic = 'force-dynamic'; 
const page = () => {
  return (
    <>
    <MainTemplates>
      <Subbanner/>
      <ShipingPolicy/>

    </MainTemplates>
    
    </>
  )
}

export default page