import Image from "next/image";

export default function AccountProfile({ name, image }: {name: string; image: string;}) {
  const hour = new Date().getHours();

  const getGreeting = () => {
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  return (
    <div className="bg-green-600 text-white rounded-md p-4 flex items-center gap-3 shadow">
      <div className="relative h-11 w-11 rounded-full overflow-hidden bg-white">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      <div>
        <p className="text-xs opacity-90">{getGreeting()}</p>
        <p className="font-medium leading-tight">{name}</p>
      </div>
    </div>
  );
}
