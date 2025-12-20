import Image from 'next/image'
import Link from 'next/link'
import { categoryData } from '@/lib/categoryData'

type Props = {
  limit?: number
  cols?: {
    mobile?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export default function CategoryGrid({ limit, cols }: Props) {
  const visible = limit ? categoryData.slice(0, limit) : categoryData

  // Set default values if not provided
  const mobileCols = cols?.mobile ?? 2
  const smCols = cols?.sm ?? 3
  const mdCols = cols?.md ?? 5
  const lgCols = cols?.lg ?? 6
  const xlCols = cols?.xl ?? 6

  // Tailwind dynamic classes
  const gridClass = `grid gap-4 grid-cols-${mobileCols} sm:grid-cols-${smCols} md:grid-cols-${mdCols} lg:grid-cols-${lgCols} xl:grid-cols-${xlCols}`

  return (
    <div className={gridClass}>
      {visible.map((cat) => (
        <Link
          key={cat.id} 
          href={`/categories/${cat.slug}`}
          className="text-center group"
        >
          <div className="relative mx-auto h-[90px] w-[90px] sm:h-[140px] sm:w-[140px] lg:h-[170px] lg:w-[170px] overflow-hidden rounded-full bg-gray-300">
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-110 transition"
            />
          </div>
          <p className="mt-3 text-sm font-medium text-gray-800">{cat.name}</p>
        </Link>
      ))}
    </div>
  )
}
