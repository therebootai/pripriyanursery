
import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/Header";
import React, { ReactNode } from "react";


interface MainTemplatesProps {
  children: ReactNode;
}

const MainTemplates: React.FC<MainTemplatesProps> = ({ children }) => {
  return (
  <>
  <Header/>
  <div>{children}</div>
  <Footer/>
  
  </>
   
 
  );
};

export default MainTemplates;
