import Image from "next/image";
import Link from "next/link";

export default function ImageSection1() {
  const images = [
    {
      imgsrc: "/assets/home/FruitPlant.jpg",
      href: "/products?category=Fruit Plant",
      title: "Fruit Plants",
    },
    {
      imgsrc: "/assets/home/Hibiscus.jpg",
      href: "/products?category=Hibiscus",
      title: "Hibiscus",
    },
    {
      imgsrc: "/assets/home/indoorplants.jpg",
      href: "/products?category=Indoor Plant",
      title: "Indoor Plants",
    },
    {
      imgsrc: "/assets/home/PlamTree.jpg",
      href: "/products?category=Palm Tree",
      title: "Palm Trees",
    },
  ];

  return (
    <section className="w-full py-10">
      <div className="self-padding">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {images.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group relative overflow-hidden rounded-2xl shadow-md"
            >
              <div className="relative h-[8rem] md:h-[13rem] w-full">
                <Image
                  src={item.imgsrc}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* text */}
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="text-sm md:text-lg font-semibold tracking-wide">
                    {item.title}
                  </h3>
                  <span className="text-xs opacity-80 group-hover:underline">
                    Shop Now →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}