import AccountProfile from "./AccountProfile";
import AccountMenu from "./AccountMenu";

type AccountSidebarProps = {
  name: string;
  image: string;
};

export default function AccountSidebar({
  name,
  image,
}: AccountSidebarProps) {
  return (
    <aside className="w-full md:w-[260px] bg-white rounded-md p-3 shadow-sm">
      <AccountProfile name={name} image={image} />
      <AccountMenu />
    </aside>
  );
}
