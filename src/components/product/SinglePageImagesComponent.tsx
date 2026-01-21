"use client";

import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useMemo } from "react";

interface Props {
  images: string[];
    isWishlisted: boolean;
  onWishlist: () => void;
  onShare: () => void;
}

const SinglePageImagesComponent: React.FC<Props> = ({ images = [],  isWishlisted,
  onWishlist,
  onShare, }) => {
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [thumbIndex, setThumbIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const mainRef = useRef<HTMLDivElement | null>(null);
  const startX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const thumbnailsToShow = Math.min(images.length, 4);
  const maxIndex = images.length - 1;

  /* ---------------- Thumbnail Logic ---------------- */
  const updateThumbIndex = (index: number) => {
    if (images.length <= 4) return;

    if (index >= thumbIndex + thumbnailsToShow) {
      setThumbIndex(thumbIndex + 1);
    }
    if (index < thumbIndex) {
      setThumbIndex(Math.max(0, thumbIndex - 1));
    }
  };

  const setMainImage = (index: number) => {
    setMainImageIndex(index);
    updateThumbIndex(index);
  };

  /* ---------------- Swipe / Drag ---------------- */
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    if (startX.current - endX > 50 && mainImageIndex < maxIndex) {
      setMainImage(mainImageIndex + 1);
    }
    if (endX - startX.current > 50 && mainImageIndex > 0) {
      setMainImage(mainImageIndex - 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const endX = e.clientX;

    if (startX.current - endX > 50 && mainImageIndex < maxIndex) {
      setMainImage(mainImageIndex + 1);
    }
    if (endX - startX.current > 50 && mainImageIndex > 0) {
      setMainImage(mainImageIndex - 1);
    }
    isDragging.current = false;
  };

  /* ---------------- Zoom Logic ---------------- */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mainRef.current) return;

    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  const visibleThumbs = useMemo(
    () => images.slice(thumbIndex, thumbIndex + thumbnailsToShow),
    [images, thumbIndex, thumbnailsToShow]
  );

  return (
    <div className="relative flex flex-col-reverse lg:flex-row gap-4">
      {/* ---------- Thumbnails ---------- */}
      <div className="flex lg:flex-col gap-4">
        {visibleThumbs.map((img, i) => {
          const index = thumbIndex + i;
          return (
            <div
              key={index}
              className={`relative w-16 h-16 cursor-pointer border ${
                index === mainImageIndex
                  ? "border-green-600 shadow-sm"
                  : "border-gray-300"
              }`}
              onClick={() => setMainImage(index)}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>

      {/* ---------- Main Image ---------- */}
      <div
        className="relative w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div
          ref={mainRef}
          className="relative w-full h-[20rem] md:h-[30rem] lg:h-[28rem] overflow-hidden border border-gray-50"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
                  <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            {/* Wishlist */}
            <button
              onClick={onWishlist}
              className="bg-white rounded-full p-2 shadow hover:scale-105 transition"
            >
              <Heart
                size={18}
                className={
                  isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600"
                }
              />
            </button>

            {/* Share */}
            <button
              onClick={onShare}
              className="bg-white rounded-full p-2 shadow hover:scale-105 transition"
            >
              <Share2 size={18} className="text-gray-600" />
            </button>
          </div>
          <Image
            src={images[mainImageIndex]}
            alt="Main Image"
            fill
            priority
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* ---------- Zoom Preview ---------- */}
        {isZoomed && (
          <div
            className="hidden md:block absolute left-[105%] top-0 size-[34rem]  bg-white shadow-lg z-[500]"
            style={{
              backgroundImage: `url(${images[mainImageIndex]})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "1800px 1800px",
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SinglePageImagesComponent;
