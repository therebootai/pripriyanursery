import CustomerLogin from '@/components/customer/CustomerLogin'
import MainTemplates from '@/templates/MainTemplates'
import React from 'react'


const page = () => {
  return (
    <>
    <MainTemplates>

      <CustomerLogin isOpen={true}/>




    </MainTemplates>
    
    </>
  )
}

export default page