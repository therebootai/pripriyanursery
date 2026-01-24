"use client";
import { Truck, BadgeCheck, MessageCircle, Percent, Leaf } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const features = [
  {
    icon: "/icons/24x7support.svg",
    title: "24×7 Plant Support",
    desc: "Expert guidance for plant care, growth, and maintenance anytime.",
  },
  {
    icon: "/icons/discounttag.svg",
    title: "Best Nursery Prices",
    desc: "Affordable pricing with seasonal offers on all plants and supplies.",
  },
  {
    icon: "/icons/easyreturn.svg",
    title: "Easy Replacement Policy",
    desc: "Hassle-free replacement on damaged plants during delivery.",
  },
  {
    icon: "/icons/freshplanttag.svg",
    title: "Fresh & Healthy Plants",
    desc: "Directly sourced, well-nurtured plants for long-lasting growth.",
  },
  {
    icon: "/icons/qualitytag.svg",
    title: "Premium Quality Assured",
    desc: "Each plant is quality-checked for health, roots, and freshness.",
  },
  {
    icon: "/icons/originalproduct.svg",
    title: "100% Original Varieties",
    desc: "Authentic plant varieties grown naturally in our nursery.",
  },
  {
    icon: "/icons/whatsapptag.svg",
    title: "WhatsApp Order Support",
    desc: "Order plants easily and get updates via WhatsApp support.",
  },
  {
    icon: "/icons/freetag.svg",
    title: "Free Plant Care Tips",
    desc: "Get free expert tips to keep your plants healthy and thriving.",
  },
];


export default function FeaturesSection() {
  const [slidesToShow, setSlidesToShow] = useState(5);
  const [autoslide, setAutoslide] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 350) {
        setSlidesToShow(1);
        setAutoslide(true);
      } else if (window.innerWidth <= 460) {
        setSlidesToShow(2);
        setAutoslide(true);
      } else if (window.innerWidth <= 860) {
        setSlidesToShow(4);
        setAutoslide(true);
      } else if (window.innerWidth <= 1024) {
        setSlidesToShow(5);
        setAutoslide(true);
      } else {
        setSlidesToShow(5);
        setAutoslide(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <section className="">
      <div className="self-padding py-4 lg:py-8">
        <div className="w-full">
          <Swiper
            slidesPerView={slidesToShow}
            spaceBetween={10}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            pagination={false}
            speed={1000}
            modules={[Autoplay]}
            className="w-full"
          >
            {features.map((item, index) => {
              return (
                <SwiperSlide
                  key={index}
                  className="relative !flex flex-col gap-2 items-center text-center px-6"
                >
                  {/* Icon */}
                  <div className=" relative size-[4rem]">
                  <Image src={item.icon} alt="icons" fill className=""/>
                  </div>

                  {/* Title */}
                  <div className=" flex flex-col gap-1">
                  <h4 className="text-sm max-sm:text-xs font-semibold text-gray-900">
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p className="mt-1 text-xs max-md:text-[10px] text-gray-500">
                  {item.desc}
                </p>
                </div>

                  {/* ✅ Vertical Divider */}

                  <span
                    className="
                    absolute right-0 top-1/2 md:my-auto
                    
                    h-24 w-px
                    -translate-y-1/2
                    bg-green-500/60
                  "
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
