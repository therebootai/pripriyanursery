export const dynamic = "force-dynamic";

import AccountShell from "@/components/account/AccountShell";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountShell>{children}</AccountShell>;
}
