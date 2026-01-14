import AccountInformation from "@/components/account-content/AccountInformation";
import { Suspense } from "react";
export const dynamic = 'force-dynamic'; 

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountInformation />
    </Suspense>
  );
};

export default page;
