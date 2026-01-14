import CustomerLogin from '@/components/customer/CustomerLogin'
import MainTemplates from '@/templates/MainTemplates'
import React from 'react'
export const dynamic = 'force-dynamic'; 

const page = () => {
  return (
    <>
    <MainTemplates>


      <CustomerLogin isOpen={true} onClose={()=> console.log("")} openSignup={()=> console.log("")}/>




    </MainTemplates>
    
    </>
  )
}

export default page