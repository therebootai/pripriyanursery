import AccountSidebar from "@/components/account/AccountSidebar";
import CartList from "@/components/cart/CartList";

export default function CartPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1300px] px-4 py-6 flex gap-6">
        <AccountSidebar
          name="Abul Hasan"
          image="/user.jpg"
        />
        <CartList />
      </div>
    </div>
  );
}
