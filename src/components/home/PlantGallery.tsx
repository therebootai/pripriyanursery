'use client'

import { useState } from 'react'
import GalleryCard from '@/components/ui/GalleryCard'
import { galleryData } from '@/lib/galleryData'

export default function PlantsGallery() {
  const [activeIndex, setActiveIndex] = useState(0)


  const limitedGallery = galleryData.slice(0, 5)

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1300px] px-4">

        <h2 className="mb-10 text-3xl font-bold">
          Plants <span className="text-green-600">Gallery</span>
        </h2>

        <div className="flex gap-3">
          {limitedGallery.map((item, index) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={`
                transition-[flex-grow]
                duration-700
                ease-in-out
                ${index === activeIndex ? 'flex-[3]' : 'flex-[1]'}
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

      </div>
    </section>
  )
}
