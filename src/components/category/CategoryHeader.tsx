export default function CategoryHeader({ category, brand, attribute }: { category: string | null, brand: string | null, attribute: string | null }) {
  return (
    <div className="rounded bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">
        Home <span className="mx-1">›</span> {category} {">"} {brand} {">"} {attribute}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-600">Sort By</span>

        <button className="rounded-full bg-green-600 px-4 py-1 text-xs text-white">
          Popularity
        </button>
        <button className="rounded-full bg-green-600 px-4 py-1 text-xs text-white">
          Price : Low to High
        </button>
        <button className="rounded-full bg-green-600 px-4 py-1 text-xs text-white">
          Price : High to Low
        </button>
        <button className="rounded-full bg-green-600 px-4 py-1 text-xs text-white">
          Newest First
        </button>
      </div>
    </div>
  );
}
