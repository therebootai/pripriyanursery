"use client"
import { useSearchParams } from "next/navigation";
import ProductCards from '@/components/ui/ProductCards'
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export type ImageType = {
  public_id: string;
  url: string;
}

export type SpecificationType = {   
    name: string;
    details: string;
}

export type ProductType = {
  id: string;
  productId: string;
  slug: string;  

  parentProduct?:string | null;
  isVariant?: boolean;
  variants?:string[];

  name: string;
  shortDescription: string;
  longDescription: string;

  coverImage: ImageType;
  images?: ImageType[];
  video?: ImageType;

  categoryLevels:string[];
  brand:string;
  attributes:string[];
  variables?: {
    name: string;
    values: string[];
  }[];
  pickup?: string;
  averageRating: number;
  ratingCount: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };

  specifications: SpecificationType[];

  mrp: number;
  price: number;
  discount: number;
  stock: number;

  status: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function ProductSection({
  title,
  products,
  pagination,
  rows = 2,
}: {
  title: string
  products: ProductType[],
  pagination: {
    totalCount: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  }
  rows?: number
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const displayProducts = allProducts;


  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product?q=${query}&page=1&limit=${pagination.limit}`
        );

        const products = await res.json();

        if (products?.success) {
          setAllProducts(products.data);
          setPage(1);
        }
      } catch (err) {
        console.error("Search failed", err);
      }
    };

    fetchSearchResults();
  }, [query]);


useEffect(() => {
  setAllProducts(products);
  setPage(1);
}, [products]);


  const loadMore = async () => {
    if (query) return;
    if (pagination.totalPages <= page) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const nextPage = page + 1;
      const newProducts = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product?limit=${pagination.limit}&page=${nextPage}`
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
      <div className="mx-auto max-w-[1300px] px-4">
        <h2 className="mb-8 text-2xl font-bold text-defined-black">{title}</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((p) => (
            <ProductCards
              key={p.id}
              id={p._id}
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
              // averageRating={p.averageRating}
              // ratingCount={p.ratingCount}
              // ratingBreakdown={p.ratingBreakdown}
              // pickup={p.pickup}
              // specification={p.specification}
              // video={p.video}
              // category={p.category}
              // tag={p.tag}
              slug={p.slug} // 🔹 pass href to ProductCards
            />
          ))}
        </div>

        {/* Infinite Scroll Loader */}
        {!query && pagination.totalPages > page && (
          <div
            className="flex justify-center items-center gap-4 mt-6"
            ref={ref}
          >
            <span className="animate-pulse text-2xl font-bold text-defined-green">
              Loading...
            </span>
            <div
              className="size-9 inline-block rounded-full border-6 border-r-defined-green border-solid animate-spin border-white"
              role="status"
              aria-label="Loading"
            ></div>
          </div>
        )}
      </div>
    </section>
  );
}
