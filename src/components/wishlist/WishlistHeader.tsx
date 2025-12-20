type WishlistHeaderProps = {
  count: number;
};

export default function WishlistHeader({ count }: WishlistHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Wishlist ({count.toString().padStart(2, "0")})
      </h2>
    </div>
  );
}
