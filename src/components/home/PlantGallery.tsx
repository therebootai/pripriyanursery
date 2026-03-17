"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import GalleryCard from "@/components/ui/GalleryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VISIBLE_COUNT = 5;

export default function PlantsGallery() {
  // ✅ ALL hooks at the very top — before any early return
  const [images, setImages] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sliding, setSliding] = useState<"left" | "right" | null>(null);
  const [mobileIdx, setMobileIdx] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileStartIndex = useRef(0); // ✅ moved here

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/media?type=image&limit=10`
        );
        setImages(res.data.data);
      } catch (err) {
        console.error("Error fetching images", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // ✅ Early return AFTER all hooks
  if (loading || images.length === 0) return null;

  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE_COUNT < images.length;

  const slideTo = (direction: "left" | "right", newStart: number) => {
    setSliding(direction);
    setTimeout(() => {
      setStartIndex(newStart);
      setSliding(null);
    }, 350);
  };

const handlePrev = () => {
  if (!canPrev) return;
  setStartIndex(prev => prev - 1);
};

const handleNext = () => {
  if (!canNext) return;
  setStartIndex(prev => prev + 1);
};
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleMobileNext();
      else handleMobilePrev();
    }
    touchStartX.current = null;
  };

  const handleMobilePrev = () => {
    if (mobileStartIndex.current <= 0) return;
    mobileStartIndex.current -= 1;
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 0;
    el.scrollTo({ left: mobileStartIndex.current * (cardWidth + 12), behavior: "smooth" });
  };

  const handleMobileNext = () => {
    if (mobileStartIndex.current >= images.length - 1) return;
    mobileStartIndex.current += 1;
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 0;
    el.scrollTo({ left: mobileStartIndex.current * (cardWidth + 12), behavior: "smooth" });
  };

  const handleMobilePrevBtn = () => {
    if (mobileIdx <= 0) return;
    const next = mobileIdx - 1;
    setMobileIdx(next);
    mobileStartIndex.current = next;
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = (el.firstElementChild as HTMLElement)?.offsetWidth ?? 0;
    el.scrollTo({ left: next * (cardWidth + 12), behavior: "smooth" });
  };

  const handleMobileNextBtn = () => {
    if (mobileIdx >= images.length - 1) return;
    const next = mobileIdx + 1;
    setMobileIdx(next);
    mobileStartIndex.current = next;
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = (el.firstElementChild as HTMLElement)?.offsetWidth ?? 0;
    el.scrollTo({ left: next * (cardWidth + 12), behavior: "smooth" });
  };

  const visibleImages = images.slice(startIndex, startIndex + VISIBLE_COUNT);
  const slideClass =
    sliding === "left"
      ? "animate-slide-left"
      : sliding === "right"
      ? "animate-slide-right"
      : "";

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-left  { animation: slideInLeft  0.35s ease both; }
        .animate-slide-right { animation: slideInRight 0.35s ease both; }
      `}</style>

      <section className="bg-white">
        <div className="self-padding py-4 lg:py-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl lg:text-3xl font-bold">
              Plants <span className="text-green-600">Gallery</span>
            </h2>
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={!canPrev || !!sliding}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200
                  ${canPrev && !sliding
                    ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer"
                    : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                disabled={!canNext || !!sliding}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200
                  ${canNext && !sliding
                    ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer"
                    : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

<div className="hidden lg:block relative overflow-hidden">
  <div 
    className="flex gap-3 transition-transform duration-500 ease-out shadow-inner"
    style={{ 
      transform: `translateX(-${startIndex * (100 / VISIBLE_COUNT)}%)`,
    }}
  >
    {images.map((item, realIndex) => {
      const isActive = realIndex === activeIndex;
      return (
        <div
          key={item._id}
          onMouseEnter={() => setActiveIndex(realIndex)}
          onClick={() => setActiveIndex(realIndex)}
          className={`transition-all duration-500 shrink-0
            ${isActive ? "w-[40%]" : "w-[17.5%]"}`} 
          style={{ 
            flex: isActive ? "2 0 auto" : "1 0 auto" 
          }}
        >
          <GalleryCard
            image={item.image.secureUrl}
            title={item.image.imageName}
            active={isActive}
            onClick={() => {}}
          />
        </div>
      );
    })}
  </div>
</div>

          <div
            ref={mobileScrollRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex lg:hidden gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {images.map((item) => (
              <div key={item._id} className="snap-center shrink-0 w-[85vw] md:w-[45vw]">
                <GalleryCard
                  image={item.image.secureUrl}
                  title={item.image.imageName}
                  active={false}
                  onClick={() => {}}
                />
              </div>
            ))}
          </div>

          <div className="flex lg:hidden items-center justify-center gap-4 mt-5">
            <button
              onClick={handleMobilePrevBtn}
              disabled={mobileIdx === 0}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200
                ${mobileIdx > 0 ? "border-green-600 text-green-600 active:bg-green-600 active:text-white" : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-gray-400 tabular-nums">
              {mobileIdx + 1} / {images.length}
            </span>
            <button
              onClick={handleMobileNextBtn}
              disabled={mobileIdx >= images.length - 1}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200
                ${mobileIdx < images.length - 1 ? "border-green-600 text-green-600 active:bg-green-600 active:text-white" : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
