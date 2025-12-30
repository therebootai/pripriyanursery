import { useCustomer } from "@/context/CustomerContext";


export default function CartHeader() {
  const {customer} = useCustomer();
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-800">
       Cart- ({customer?.cart.length || 0})
      </h2>
    </div>
  );
}
