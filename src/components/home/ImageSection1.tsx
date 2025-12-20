import Image from 'next/image'

export default function ImageSection1() {
  const images = [
    '/assets/home/rodeimage.png',
    '/assets/home/grayimage.png',
    '/assets/home/yellowImage.png',
    '/assets/home/rodeimage.png',
  ]

  return (
    <section className="w-full py-12">
      <div className="mx-auto max-w-[1300px] px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative h-[180px] sm:h-[220px] lg:h-[260px] overflow-hidden rounded-lg"
            >
              <Image
                src={src}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
