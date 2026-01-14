import PrivacyPolicy from '@/components/condition/PrivacyPolicy'
import Subbanner from '@/components/globals/Subbanner'
import MainTemplates from '@/templates/MainTemplates'
import React from 'react'
export const dynamic = 'force-dynamic'; 
const page = () => {
  return (
    <>
    <MainTemplates>
      <Subbanner/>
      <PrivacyPolicy/>

    </MainTemplates>
    
    </>
  )
}

export default page