import Image from "next/image";

type Props = {
  name: string;
  image: string;
};

export default function AccountProfile({ name, image }: Props) {
  return (
    <div className="bg-green-600 text-white rounded-md p-4 flex items-center gap-3 shadow">
      <div className="relative h-11 w-11 rounded-full overflow-hidden bg-white">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      <div>
        <p className="text-xs opacity-90">Good Morning</p>
        <p className="font-medium leading-tight">{name}</p>
      </div>
    </div>
  );
}
