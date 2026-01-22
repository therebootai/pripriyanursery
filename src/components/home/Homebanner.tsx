"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

export default function Homebanner() {
  const images = [
    "/assets/home/banner.png",
    "/assets/home/banner.png",
    "/assets/home/banner.png",
    "/assets/home/banner.png",
    "/assets/home/banner.png",
  ];

  return (
    <div className="relative w-full">
      {/* Swiper */}
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop
        navigation={{
          nextEl: ".banner-next",
          prevEl: ".banner-prev",
        }}
        className=" mt-[-50px] mb-[-30px]  md:mt-0 md:mb-0"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[13rem]  md:h-[450px] lg:h-[520px] w-full">
              <Image
                src={src}
                alt={`Banner ${index + 1}`}
                fill
                priority={index === 0}
                className="object-contain md:object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Prev Button */}
      <button className="banner-prev absolute left-0 top-1/2 z-10 -translate-y-1/2  bg-white/80 py-6 shadow hover:bg-white  rounded-tr-[12px] rounded-br-[12px]">
        <ChevronLeft size={20} className="text-black" />
      </button>

      {/* Next Button */}
      <button className="banner-next absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-tl-[12px] rounded-bl-[12px] bg-white/80 py-6  shadow hover:bg-white">
        <ChevronRight size={20} className="text-black" />
      </button>
    </div>
  );
}
