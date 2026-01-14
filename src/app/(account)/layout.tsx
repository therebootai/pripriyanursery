export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccountShell from "@/components/account/AccountShell";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("token");

 if (!token?.value) {
    redirect("/");
  }

  return <AccountShell>{children}</AccountShell>;
}
