"use client"
import {
  Truck,
  BadgeCheck,
  MessageCircle,
  Percent,
  Leaf,
} from 'lucide-react'
import { useEffect, useState } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const features = [
  {
    icon: Truck,
    title: '24*7 Free Support',
    // desc: 'Get shipping on order over ₹500 only.',
  },
  {
    icon: BadgeCheck,
    title: '24*7 Free Support',
    // desc: 'Get shipping on order over ₹500 only.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Support',
    // desc: 'Get shipping on order over ₹500 only.',
  },
  {
    icon: Percent,
    title: '24*7 Free Support',
    // desc: 'Get shipping on order over ₹500 only.',
  },
  {
    icon: Leaf,
    title: '24*7 Free Support',
    // desc: 'Get shipping on order over ₹500 only.',
  },
]

export default function FeaturesSection() {
       const [slidesToShow, setSlidesToShow] = useState(5);
       const [autoslide, setAutoslide] = useState(true)
    
      useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth <= 350){
setSlidesToShow(1)
setAutoslide(true)
          } 
          else if (window.innerWidth <= 460) {
setSlidesToShow(2)
setAutoslide(true)
          }
          else if (window.innerWidth <= 860) {
setSlidesToShow(4)
setAutoslide(true)
          }
          else if (window.innerWidth <= 1024) {
setSlidesToShow(5)
setAutoslide(false)
          }
          else {
            setSlidesToShow(5)
setAutoslide(false)
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
          delay: 1800,
          disableOnInteraction: false,
        }}
        pagination={false}
        modules={[  Autoplay]}
        className="w-full"
      >
          {features.map((item, index) => {
            const Icon = item.icon
            return (
              <SwiperSlide
                key={index}
                className="relative !flex flex-col items-center text-center px-6"
              >
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                  <Icon size={22} />
                </div>

                {/* Title */}
                <h4 className="text-sm font-semibold text-gray-900">
                  {item.title}
                </h4>

                {/* Description */}
                {/* <p className="mt-1 text-xs text-gray-500">
                  {item.desc}
                </p> */}

                {/* ✅ Vertical Divider */}
              
                  <span className="
                    absolute right-0 top-1/2
                    
                    h-20 w-px
                    -translate-y-1/2
                    bg-green-500/60
                  " />
             
              </SwiperSlide>
            )
          })}
          </Swiper>

        </div>
      </div>
    </section>
  )
}
