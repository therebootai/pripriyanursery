import { Star } from 'lucide-react'

export default function ProductInfo() {
  return (
    <div>
      <h1 className="text-2xl font-bold">
        Syngonium Plant (Pack of 1)
      </h1>

      {/* Rating */}
      <div className="mt-2 flex items-center gap-2 text-sm">
        <span className="flex items-center gap-1 rounded bg-green-600 px-2 py-1 text-white">
          <Star size={14} /> 4.9
        </span>
        <span className="text-gray-500">
          6,426 Ratings & 477 Reviews
        </span>
      </div>

      {/* Price */}
      <div className="mt-4">
        <p className="text-sm text-gray-500">Special price</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-green-600">₹196</span>
          <span className="text-sm line-through text-gray-400">₹502</span>
          <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-600">
            43% OFF
          </span>
        </div>
      </div>

      {/* Pincode */}
      <div className="mt-4 flex gap-2">
        <input
          placeholder="Enter pin code"
          className="w-40 rounded border px-3 py-2 text-sm"
        />
        <button className="rounded bg-yellow-400 px-4 py-2 text-sm font-semibold">
          Check
        </button>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button className="flex-1 rounded bg-yellow-400 py-3 font-semibold">
          Add to Cart
        </button>
        <button className="flex-1 rounded bg-green-600 py-3 font-semibold text-white">
          Buy Now
        </button>
      </div>
    </div>
  )
}
