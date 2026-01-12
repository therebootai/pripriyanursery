"use client"
import { useSearchParams } from "next/navigation";
import ProductCards from '@/components/ui/ProductCards'
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import CardSkeleton from '../ui/CardSkeleton';
import { ProductType } from "@/types/types";

export default function ProductSection({
  title,
  products,
  pagination,
}: {
  title: string
  products: ProductType[],
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }
}) {
  const searchParams = useSearchParams();
  // const query = searchParams.get("q")?.toLowerCase() || "";
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const displayProducts = allProducts;
  const limit = 2;

  // useEffect(() => {
  //   if (!query) return;

  //   const fetchSearchResults = async () => {
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_URL}/product?q=${query}&page=1&limit=${limit}`
  //       );

  //       const products = await res.json();

  //       if (products?.success) {
  //         setAllProducts(products.data);
  //         setPage(1);
  //       }
  //     } catch (err) {
  //       console.error("Search failed", err);
  //     }
  //   };

  //   fetchSearchResults();
  // }, [query]);


useEffect(() => {
  setAllProducts(products);
  setPage(1);
}, [products]);


  const loadMore = async () => {
    // if (query) return;
    if (pagination.totalPages <= page) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const nextPage = page + 1;
      const newProducts = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product?limit=${limit}&page=${nextPage}`
      ).then((res) => res.json());
      if (newProducts?.success) {
        setAllProducts((prev) => [...prev, ...newProducts.data]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more orders", error);
    }
  };

  useEffect(() => {
    if (inView) loadMore();
  }, [inView]);  

  return (
    <section className="pt-2 pb-6">
      <div className="self-padding flex flex-col gap-6">
        <h2 className=" md:text-2xl font-bold text-defined-black">{title}</h2>
        <div className="grid gap-1 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((p) => (
            <ProductCards
              key={p.productId}
              _id={p._id}
              productId={p.productId}
              attributes={p.attributes}
              variables={p.variables}
              name={p.name}
              price={p.price}
              coverImage={p.coverImage}
              images={p.images}
              brand={p.brand}
              longDescription={p.longDescription}
              shortDescription={p.shortDescription}
              mrp={p.mrp}
              discount={p.discount}
              stock={p.stock}
              averageRating={p.averageRating}
              ratingCount={p.ratingCount}
              ratingBreakdown={p.ratingBreakdown}
              pickup={p.pickup}
              specifications={p.specifications}
              video={p.video}
              status={p.status}
              category={p.category}
              subCategory={p.subCategory}
              createdAt={p.createdAt}
              updatedAt={p.updatedAt}
              isVariant={p.isVariant}
              parentProduct={p.parentProduct}
              variants={p.variants}              
              slug={p.slug}
            />
          ))}
        </div>

        {/* Infinite Scroll Loader */}
        {pagination.totalPages > page && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xlg:grid-cols-4 gap-6"
            ref={ref}
          >
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />            
                        
          </div>
        )}
      </div>
    </section>
  );
}
