import MainTemplates from "@/templates/MainTemplates";
import CartList from "@/components/cart/CartList";
import { Suspense } from "react";
export const dynamic = 'force-dynamic'; 

export default function CartPage() {
  return (
    <MainTemplates>
      <Suspense fallback={<div>Loading...</div>}>

      <CartList />
      </Suspense>
    </MainTemplates>
  );
}
