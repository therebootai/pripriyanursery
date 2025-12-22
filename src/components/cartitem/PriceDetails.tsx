export default function PriceDetails({ totals }: any) {
  return (
    <div className="bg-white border rounded-md p-4 h-fit">
      <h3 className="font-semibold text-gray-700 mb-4">
        PRICE DETAILS
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Price</span>
          <span>₹{totals.price}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-₹{totals.discount}</span>
        </div>

        <div className="flex justify-between">
          <span>Protect Promise Fee</span>
          <span>₹46</span>
        </div>

        <hr />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total Amount</span>
          <span>₹{totals.total + 46}</span>
        </div>
      </div>

      <p className="mt-4 text-green-600 text-sm font-medium">
        You will save ₹{totals.discount} on this order
      </p>
    </div>
  );
}
