export default function CategoryHeader({ category }: { category: string }) {
  return (
    <div className="rounded bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">
        Home <span className="mx-1">›</span> {decodeURIComponent(category)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-600">Sort By</span>

        <button className="rounded-full bg-green-600 px-4 py-1 text-xs text-white">
          Popularity
        </button>
      </div>
    </div>
  );
}
