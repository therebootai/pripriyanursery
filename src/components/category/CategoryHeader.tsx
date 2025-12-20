export default function CategoryHeader() {
  return (
    <div className="rounded bg-white p-6 shadow-sm">

      {/* Breadcrumb */}
      <p className="text-sm text-gray-500">
        Home <span className="mx-1">›</span> Indoor Plants
      </p>

      {/* Sort */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-600">Sort By</span>

        <button className="rounded-full bg-green-600 px-4 py-1 text-xs text-white">
          Popularity
        </button>

        {['Price Low to High', 'Price High to Low', 'Newest First'].map(
          (item) => (
            <button
              key={item}
              className="rounded-full bg-gray-100 px-4 py-1 text-xs text-gray-700"
            >
              {item}
            </button>
          )
        )}
      </div>
    </div>
  )
}
