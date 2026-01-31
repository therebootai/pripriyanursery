import Subbanner from "@/components/globals/Subbanner";
import MainTemplates from "@/templates/MainTemplates";
import HomeCategory from "@/components/home/HomeCategory";
import { Suspense } from "react";
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  return (
    <MainTemplates>
      <Subbanner />
      <Suspense fallback={<div>loading...</div>}>
        <section className="py-6">
          <div className="">
            <HomeCategory limit={8} enableLazy={true} />
          </div>
        </section>
      </Suspense>
    </MainTemplates>
  );
}
