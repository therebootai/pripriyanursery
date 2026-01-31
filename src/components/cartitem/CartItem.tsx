import Image from "next/image";
import { FaRupeeSign } from "react-icons/fa";

export default function CartItem({ item }: any) {
  return (
    <div className="bg-white border rounded-md p-4 flex gap-4">
      <div className="relative w-28 h-28 bg-gray-100">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>

      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-500">Category: {item.category}</p>
        <p className="text-sm text-gray-500">Tag: {item.tag}</p>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-semibold">
            <FaRupeeSign className="inline" />
            {item.price}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600">Quantity: {item.qty}</p>
      </div>
    </div>
  );
}
