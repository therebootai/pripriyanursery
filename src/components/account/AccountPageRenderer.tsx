
// etc

import AccountInformation from "../account-content/AccountInformation";
import ManageAddress from "../account-content/ManageAddress";
import CartList from "../cart/CartList";
import MyOrders from "../order/MyOrders";
import ReviewPage from "../review/Review";
import WishlistList from "../wishlist/WishlistList";

export default function AccountPageRenderer({ route } : { route: string }) {
  if (route === "/my-orders") return <MyOrders />;
  if (route === "/my-wishlist") return <WishlistList />;
  if (route === "/my-account") return <AccountInformation />;
  if (route === "/manage-address") return <ManageAddress />;
  if (route === "/my-reviews") return <ReviewPage />;
  if (route === "/my-cart") return <CartList />;
  return null;
}
