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
      <div className=" self-padding">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative h-[7rem] md:h-[12rem] w-full rounded-lg"
            >
              <Image
                src={src}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
