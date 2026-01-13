import AccountSidebar from "@/components/account/AccountSidebar";
import MainTemplates from "@/templates/MainTemplates";

export default function AccountShell({
  children,
}: {
  children: React.ReactNode;
}) {  

  return (
    <MainTemplates>
      <div className="bg-gray-50 min-h-screen md:px-8 lg:px-16 lg:py-4 w-full">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <AccountSidebar
           
          />

          {/* Content */}
          <div className="flex-1 hidden lg:block w-full">{children}</div>
        </div>
      </div>
    </MainTemplates>
  );
}
