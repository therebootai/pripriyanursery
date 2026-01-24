
// etc

import AccountInformation from "../account-content/AccountInformation";
import ManageAddress from "../account-content/ManageAddress";
import CartList from "../cart/CartList";
import MyOrders from "../order/MyOrders";
import ShowReview from "../review/ShowReview";
import WishlistList from "../wishlist/WishlistList";

export default function AccountPageRenderer({ route } : { route: string }) {
  if (route === "/my-orders") return <MyOrders />;
  if (route === "/my-wishlist") return <WishlistList />;
  if (route === "/my-account") return <AccountInformation />;
  if (route === "/manage-address") return <ManageAddress />;
  if (route === "/my-reviews") return <ShowReview />;
  if (route === "/my-cart") return <CartList />;
  return null;
}
