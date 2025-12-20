import ProductCards from '@/components/ui/ProductCards'

type Product = {
  id: number
  name: string
  price?: number
  rating?: number
  image: string
  category?: string
  tag?: string
  href: string // 🔹 required for dynamic product page
}

export default function ProductSection({
  title,
  products,
  rows = 2,
}: {
  title: string
  products: Product[]
  rows?: number
}) {
  const maxItems = rows * 4 // 4 cards per row
  const displayProducts = products.slice(0, maxItems)

  return (
    <section className="pt-2 pb-6">
      <div className="mx-auto max-w-[1300px] px-4">
        <h2 className="mb-8 text-2xl font-bold">{title}</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((p) => (
            <ProductCards
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price}
              image={p.image}
              category={p.category}
              tag={p.tag}
              href={p.href} // 🔹 pass href to ProductCards
            />
          ))}
        </div>
      </div>
    </section>
  )
}
