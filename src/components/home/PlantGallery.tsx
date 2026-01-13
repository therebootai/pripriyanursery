'use client'

import { useState } from 'react'
import GalleryCard from '@/components/ui/GalleryCard'
import { galleryData } from '@/lib/galleryData'

export default function PlantsGallery() {
  const [activeIndex, setActiveIndex] = useState(0)


  const limitedGallery = galleryData.slice(0, 5)

  return (
    <section >
      <div className="self-padding">
        <h2 className="mb-10 text-xl lg:text-3xl font-bold">
          Plants <span className="text-green-600">Gallery</span>
        </h2>

        <div
          className="md:hidden max-w-screen
    flex gap-3
    md:overflow-visible
    overflow-x-auto
    snap-x snap-mandatory
    scrollbar-hide
    md:snap-none
  "
        >
          {limitedGallery.map((item, index) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={`
    transition-[flex-grow]
    duration-700
    ease-in-out

    md:${index === activeIndex ? "flex-[3]" : "flex-[1]"}

    md:flex-shrink
    md:w-auto

    flex-shrink-0
    w-[80vw]

    snap-center
  `}
            >
              <GalleryCard
                image={item.image}
                title={item.title}
                active={index === activeIndex}
                onClick={() => {}}
              />
            </div>
          ))}
        </div>

        <div className="hidden md:flex gap-3 overflow-hidden"> 
          {limitedGallery.map((item, index) => ( 
            <div key={item.id} 
            onMouseEnter={() => setActiveIndex(index)} 
            onClick={() => setActiveIndex(index)} 
            className={` transition-[flex-grow] duration-700 ease-in-out ${index === activeIndex ? 'flex-[3]' : 'flex-[1]'} `} > 
            <GalleryCard 
            image={item.image} 
            title={item.title} 
            active={index === activeIndex} 
            onClick={() => {}} 
            /> 

            </div>
           ))} 
           </div>
      </div>
    </section>
  );
}
