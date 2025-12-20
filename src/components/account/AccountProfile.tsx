"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type AccountProfileProps = {
  name: string;
  image: string;
};

export default function AccountProfile({
  name,
  image,
}: AccountProfileProps) {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <div className="bg-green-700 text-white rounded-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-white">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>
          <div className="text-left">
            <p className="text-xs opacity-90">Good Morning</p>
            <p className="font-medium">{name}</p>
          </div>
        </div>

        <ChevronDown
          size={18}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-3 text-sm opacity-90">
          Welcome to your account
        </div>
      )}
    </div>
  );
}
