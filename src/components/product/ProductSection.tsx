"use client";

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import ProductCards from '@/components/ui/ProductCards';
import CardSkeleton from '../ui/CardSkeleton';
import { ProductType } from "@/types/types";

export default function ProductSection({
  title,
  products,
  pagination,
  limit = 10,
  apiQuery = "",
  enableLazy = false // 👈 NEW: Default is false (only shows 10 items)
}: {
  title: string
  products: ProductType[],
  limit?: number,
  apiQuery?: string,
  enableLazy?: boolean, // Define the prop type
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }
}) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });
  
  const [allProducts, setAllProducts] = useState<ProductType[]>(products);

  useEffect(() => {
    setAllProducts(products);
    setPage(1);
  }, [products]);

  const loadMore = async () => {
    // Stop if lazy loading is disabled OR already loading OR no more pages
    if (!enableLazy || loading || page >= pagination.totalPages) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/product?limit=${limit}&page=${nextPage}&${apiQuery}`;
      
      const res = await fetch(url);
      const newProducts = await res.json();

      if (newProducts?.success) {
        setAllProducts((prev) => [...prev, ...newProducts.data]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView && enableLazy) loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, enableLazy]);

  return (
    <section className="pt-2 pb-6">
      <div className="self-padding flex flex-col gap-6">
        <h2 className="md:text-2xl font-bold text-defined-black">{title}</h2>
        
        <div className="grid gap-1 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxxl:grid-cols-6">
          {allProducts.map((p, index) => (
            <ProductCards
               key={`${p._id}-${index}`}
               _id={p._id}
               name={p.name}
               price={p.price}
               coverImage={p.coverImage}
               mrp={p.mrp}
               discount={p.discount}
               slug={p.slug}
               height='h-[12rem] md:h-[12rem] lg:h-[14rem] xxl:h-[16rem]'
            />
          ))}
        </div>

        {/* Infinite Scroll Loader 
           Only renders if:
           1. enableLazy is TRUE
           2. There are actually more pages to load
        */}
        {enableLazy && pagination.totalPages > page && (
          <div
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xlg:grid-cols-4 gap-6 mt-4"
            ref={ref}
          >
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <div className="hidden lg:block"><CardSkeleton /></div>
          </div>
        )}
      </div>
    </section>
  );
}