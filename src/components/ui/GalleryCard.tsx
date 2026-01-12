import Image from 'next/image'
import clsx from 'clsx'

type Props = {
  image: string
  title: string
  active: boolean
  onClick: () => void
}

export default function GalleryCard({
  image,
  title,
  active,
}: Props) {
  return (
    <div
      className="
        group relative h-[380px] w-full cursor-pointer overflow-hidden rounded-xl
        transition-all duration-700 ease-in-out
        will-change-transform
      "
    >
      {/* Image */}
      <Image
        src={image}
        alt={title}
        width={500}
        height={500}
        className="
          object-cover
          transition-transform duration-700 ease-in-out
          group-hover:scale-110 size-full 
        "
      />


      <div
        className={clsx(
          `
          absolute inset-0
          bg-gradient-to-t from-green-800/80 via-green-700/40 to-transparent
          transition-opacity duration-500 ease-in-out
          `,
          active
            ? 'opacity-100'
            : 'opacity-80 group-hover:opacity-100'
        )}
      />

   
      <div
        className={clsx(
          `
          absolute bottom-4 left-4 z-10
          transition-all duration-500 ease-in-out
          `,
          active
            ? 'opacity-100 translate-y-0'
            : 'opacity-90 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
        )}
      >
        <h3 className="md:text-lg text-[14px] font-semibold text-white">
          {title}
        </h3>
      </div>
    </div>
  )
}
