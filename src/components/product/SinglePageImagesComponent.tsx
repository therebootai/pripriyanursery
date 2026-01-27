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
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

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
    <>
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
          className="relative w-full h-[25rem] md:h-[30rem] lg:h-[26rem] xl:h-[28rem] overflow-hidden border border-gray-50 cursor-crosshair"
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
            className="object-cover"
             onClick={() => {
    if (window.innerWidth < 768) {
      setIsMobilePreviewOpen(true);
    }
  }}
          />
          {isZoomed && (
            <div
              className="absolute pointer-events-none z-10 hidden md:block"
              style={{
                top: `${zoomPos.y}%`,
                left: `${zoomPos.x}%`,
                transform: "translate(-50%, -50%)", // Centers lens on cursor
                width: "150px", // Adjust width of lens
                height: "150px", // Adjust height of lens
                backgroundColor: "rgba(0, 100, 255, 0.2)", // Blue transparent bg
                border: "1px solid rgba(0, 100, 255, 0.5)", // Blue border
              }}
            />
          )}
        </div>

        {/* ---------- Zoom Preview ---------- */}
        {isZoomed && (
          <div
            className="hidden md:block absolute left-[105%] top-0 xlg:size-[30rem] lg:size-[28rem] xl:size-[34rem]  xxl:size-[36rem] bg-white shadow-lg z-[500]"
            style={{
              backgroundImage: `url(${images[mainImageIndex]})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "1200px 1200px",
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
          />
        )}
      </div>
 {isMobilePreviewOpen && (
  <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
    
    {/* Close Button */}
    <button
      onClick={() => setIsMobilePreviewOpen(false)}
      className="absolute top-[8rem] right-4 z-20 bg-gray-100 rounded-full size-9 flex items-center justify-center shadow"
    >
      ✕
    </button>

    {/* Main Image */}
    <div className="relative flex-1 flex items-center justify-center px-4">
      <Image
        src={images[mainImageIndex]}
        alt="Preview Image"
        fill
        sizes="100vw"
        className="object-contain"
        priority
      />
    </div>

    {/* Thumbnail Strip */}
    <div className="w-full px-3 pb-4">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setMainImage(index)}
            className={`relative min-w-[64px] h-16 border rounded cursor-pointer ${
              index === mainImageIndex
                ? "border-green-600"
                : "border-gray-300"
            }`}
          >
            <Image
              src={img}
              alt={`thumb-${index}`}
              fill
              sizes="64px"
              className="object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>

  </div>
)}


    </div>
 

    </>
  );
};

export default SinglePageImagesComponent;
