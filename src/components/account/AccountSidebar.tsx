import AccountProfile from "./AccountProfile";
import AccountMenu from "./AccountMenu";
import { AccountSection } from "@/types/account";
import { Menu } from "lucide-react";

type Props = {
  active: AccountSection;
  onChange: (section: AccountSection) => void;
  open: boolean;
  onToggle: () => void;
};

export default function AccountSidebar({
  active,
  onChange,
  open,
  onToggle,
}: Props) {
  return (
    <aside className="w-full md:w-[300px] bg-white rounded-md p-3 shadow-sm">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden mb-2">
        <span className="font-medium text-gray-800">My Account</span>
        <button onClick={onToggle}>
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Content */}
      <div
        className={`transition-all duration-300 overflow-hidden
        ${open ? "max-h-[1000px]" : "max-h-0 md:max-h-none"}
        `}
      >
        <AccountProfile
          name="Abul Hasan"
          image="/assets/images (3).jpeg"
        />

        <AccountMenu
          active={active}
          onChange={(section) => {
            onChange(section);
            onToggle(); // auto close on mobile
          }}
        />
      </div>
    </aside>
  );
}
