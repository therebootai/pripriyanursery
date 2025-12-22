type CartHeaderProps = {
  count: number;
};

export default function CartHeader({ count }: CartHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-800">
       Cart- ({count.toString().padStart(2, "0")})
      </h2>
    </div>
  );
}
