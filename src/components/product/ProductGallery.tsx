'use client'
import Image from 'next/image'
import { useState } from 'react'

const images = [
  '/assets/product/p1.png',
  '/assets/product/p1.png',
  '/assets/product/p1.png',
  '/assets/product/p1.png',
]

export default function ProductGallery() {
  const [active, setActive] = useState(0)

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-3">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className={`relative h-20 w-20 cursor-pointer rounded border ${
              active === i ? 'border-green-600' : 'border-gray-200'
            }`}
          >
            <Image src={img} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative h-[420px] w-full rounded bg-gray-100">
        <Image
          src={images[active]}
          alt="Product"
          fill
          className="object-contain"
        />
      </div>
    </div>
  )
}
