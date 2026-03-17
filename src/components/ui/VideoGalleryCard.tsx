"use client";

import Image from 'next/image';
import { FiPlay } from 'react-icons/fi';
import clsx from 'clsx';

type Props = {
  thumbnail: string;
  title: string;
  active: boolean;
  onClick: () => void;
};

export default function VideoGalleryCard({ thumbnail, title, active, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="group relative h-[400px] w-full cursor-pointer overflow-hidden rounded-2xl transition-all duration-700 ease-in-out border border-white/10 "
    >
      <Image
        src={thumbnail}
        alt={title}
        width={600}
        height={800}
        className="object-cover transition-transform duration-700 ease-in-out  size-full"
      />

      <div
        className={clsx(
          "absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent transition-opacity duration-500",
          active ? 'opacity-90' : 'opacity-60 group-hover:opacity-80'
        )}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className={clsx(
          "bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 transition-all duration-500 transform shadow-lg",
          active ? "scale-100 opacity-100" : "scale-75 opacity-100 "
        )}>
          <FiPlay className="text-white text-3xl fill-current" />
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 z-10">
        <h3 className={clsx(
          "font-bold text-white transition-all duration-500",
          active ? "text-xl translate-y-0" : "text-sm translate-y-4 group-hover:translate-y-0 opacity-80"
        )}>
          {title}
        </h3>
      </div>
    </div>
  );
}