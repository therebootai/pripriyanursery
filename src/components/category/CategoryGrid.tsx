import Image from 'next/image'
import Link from 'next/link'


type Props = {
  data?: {
    categoryId: string;
    name: string;
    image: string;
    slug: string;
  }[];
  limit?: number;
  cols?: {
    mobile?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
};

export default function CategoryGrid({ data = [], limit, cols }: Props) {
  const visible = limit ? data.slice(0, limit) : data


  
  const mobileCols = cols?.mobile ?? 2
  const smCols = cols?.sm ?? 3
  const mdCols = cols?.md ?? 5
  const lgCols = cols?.lg ?? 6
  const xlCols = cols?.xl ?? 6

 
  const gridClass = `grid gap-4 grid-cols-${mobileCols} sm:grid-cols-${smCols} md:grid-cols-${mdCols} lg:grid-cols-${lgCols} xl:grid-cols-${xlCols}`

  return (
    <div className={gridClass}>
      {visible.map((cat) => (
        <Link
          key={cat.categoryId} 
          href={`/categories/${cat.name}`}
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
          <p className="mt-4 text-[17px] text-gray-900"
             style={{fontWeight:"560"}}
          >{cat.name}</p>
        </Link>
      ))}
    </div>
  )
}
