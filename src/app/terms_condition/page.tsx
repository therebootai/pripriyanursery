import TermandCondition from '@/components/condition/TermandCondition'
import Subbanner from '@/components/globals/Subbanner'
import MainTemplates from '@/templates/MainTemplates'
import React from 'react'
export const dynamic = 'force-dynamic'; 
const page = () => {
  return (
    <>
    <MainTemplates>
      <Subbanner/>
      <TermandCondition/>

    </MainTemplates>
    
    </>
  )
}

export default page