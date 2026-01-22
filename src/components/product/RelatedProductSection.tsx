"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import ProductCards from "../ui/ProductCards";
import { ProductType } from "@/types/types";

interface RelatedProductSectionProps {
  slug: string;
}

type Product = {
  _id: string;
  slug: string;
  name: string;
  price: number;
  mrp?: number;
  discount?: number;
  coverImage?: {
    url: string;
  };
};

export default function RelatedProductSection({
  slug,
}: RelatedProductSectionProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchRelatedProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product/${slug}/related`,
          { cache: "no-store" },
        );

        const data = await res.json();

        if (data?.success) {
          setProducts(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch related products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [slug]);

  if (loading || products.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-defined-black mb-4">
        Related Products
      </h2>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={5}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        
        breakpoints={{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1250: { slidesPerView: 5 },
          2400:{slidesPerView:6},
        }}
      >
        {products.map((p, index) => (
          <SwiperSlide key={p._id}>
            <ProductCards
              key={`${p._id}-${index}`}
              _id={p._id}
              name={p.name}
              price={p.price}
              coverImage={p.coverImage}
              mrp={p.mrp}
              discount={p.discount}
              slug={p.slug}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
