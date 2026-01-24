"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";

// Define a type for your banner data
type Banner = {
  _id: string;
  image: {url:string}; // Or { url: string } depending on your backend
  title?: string;
};

export default function Homebanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // 👇 Update this URL to match your specific API endpoint
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/slider?page=1&limit=8&status=true`);
        
        if (res.data.success) {
          // Assuming your API returns { success: true, data: [...] }
         setBanners(res.data.sliders || []); 
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Optional: Loading Skeleton
  if (loading) {
    return (
      <div className="w-full h-[13rem] md:h-[450px] lg:h-[520px] bg-gray-200 animate-pulse" />
    );
  }

  // If no banners found, don't render the slider
  if (banners.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Swiper */}
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={banners.length > 1} // Only loop if more than 1 image
        navigation={{
          nextEl: ".banner-next",
          prevEl: ".banner-prev",
        }}
        className=" md:mt-0 md:mb-0"
      >
        {banners.map((item, index) => (
          <SwiperSlide key={item._id || index}>
            <div className="relative h-[13rem] md:h-[450px] lg:h-[520px] w-full">
              <Image
                src={item.image.url} 
                alt={`Banner ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Prev Button - Only show if we have multiple banners */}
      {banners.length > 1 && (
        <button className="banner-prev absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 py-6 shadow hover:bg-white rounded-tr-[12px] rounded-br-[12px] cursor-pointer">
          <ChevronLeft size={20} className="text-black" />
        </button>
      )}

      {/* Next Button - Only show if we have multiple banners */}
      {banners.length > 1 && (
        <button className="banner-next absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-tl-[12px] rounded-bl-[12px] bg-white/80 py-6 shadow hover:bg-white cursor-pointer">
          <ChevronRight size={20} className="text-black" />
        </button>
      )}
    </div>
  );
}