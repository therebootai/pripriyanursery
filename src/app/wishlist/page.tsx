import AccountSidebar from "@/components/account/AccountSidebar";
import WishlistList from "@/components/wishlist/WishlistList";
import MainTemplates from "@/templates/MainTemplates";

export default function WishlistPage() {
  return (
    <MainTemplates>
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1300px] px-4 py-6 flex gap-6">
        <AccountSidebar
          name="Abul Hasan"
          image="/user.jpg"
        />

        <WishlistList />
      </div>
    </div>
    </MainTemplates>
  );
}
