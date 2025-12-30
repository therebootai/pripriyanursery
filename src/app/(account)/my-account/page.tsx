import AccountInformation from "@/components/account-content/AccountInformation";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountInformation />
    </Suspense>
  );
};

export default page;
