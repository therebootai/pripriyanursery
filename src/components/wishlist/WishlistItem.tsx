import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";

type WishlistItemProps = {
  id: number;
  name: string;
  price?: number;
  image: string;
  href: string;
};

export default function WishlistItem({
  id,
  name,
  price,
  image,
  href,
}: WishlistItemProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-md p-4 shadow-sm">
      {/* Left */}
      <div className="flex gap-4 items-center">
        <div className="relative h-20 w-20 rounded overflow-hidden bg-gray-100">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>

        <div>
          <h4 className="font-medium text-gray-800">{name}</h4>
          {price && (
            <p className="mt-1 text-sm font-semibold text-gray-700">
              ₹{price}
            </p>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="text-red-500 hover:text-red-600">
          <Trash2 size={16} />
        </button>

        <button className="text-green-600 hover:text-green-700">
          <ShoppingCart size={16} />
        </button>

        <Link
          href={`/product/${href}`}
          className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          View Item
        </Link>
      </div>
    </div>
  );
}
