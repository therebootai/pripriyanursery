"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import VideoGalleryCard from "@/components/ui/VideoGalleryCard";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const VISIBLE_COUNT = 5;

export default function VideoGallery() {
  const [videos, setVideos] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileIdx, setMobileIdx] = useState(0);

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileStartIndex = useRef(0);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/media?type=video&limit=10`);
        setVideos(res.data.data);
      } catch (err) {
        console.error("Error fetching videos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading || videos.length === 0) return null;

  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE_COUNT < videos.length;

  // Desktop Navigation
  const handlePrev = () => {
    if (canPrev) setStartIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (canNext) setStartIndex((prev) => prev + 1);
  };

  // Mobile Navigation Logic (Same as Image Section)
  const handleMobilePrevBtn = () => {
    if (mobileIdx <= 0) return;
    const next = mobileIdx - 1;
    setMobileIdx(next);
    mobileStartIndex.current = next;
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = (el.firstElementChild as HTMLElement)?.offsetWidth ?? 0;
    el.scrollTo({ left: next * (cardWidth + 16), behavior: "smooth" });
  };

  const handleMobileNextBtn = () => {
    if (mobileIdx >= videos.length - 1) return;
    const next = mobileIdx + 1;
    setMobileIdx(next);
    mobileStartIndex.current = next;
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = (el.firstElementChild as HTMLElement)?.offsetWidth ?? 0;
    el.scrollTo({ left: next * (cardWidth + 16), behavior: "smooth" });
  };

  return (
    <section className="py-12 bg-white overflow-hidden">
      {/* Video Popup Overlay */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300">
          <button 
            onClick={() => setSelectedVideo(null)} 
            className="absolute top-8 right-8 text-white hover:text-indigo-400 z-[110]"
          >
            <FiX size={32} />
          </button>
          <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
            <ReactPlayer src={selectedVideo} controls playing width="100%" height="100%" />
          </div>
        </div>
      )}

      <div className="self-padding">
        {/* Header with Arrows for Desktop */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl lg:text-3xl font-bold">
            Video <span className="text-green-600">Gallery</span>
          </h2>
          
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!canPrev}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300
                ${canPrev ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white" : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300
                ${canNext ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white" : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Container - Desktop */}
        <div className="hidden lg:block relative overflow-hidden">
          <div 
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(-${startIndex * (100 / VISIBLE_COUNT)}%)`,
            }}
          >
            {videos.map((item, index) => (
              <div
                key={item._id}
                className="" 
              >
                <VideoGalleryCard
                  thumbnail={item.video.thumbnailUrl}
                  title={item.video.videoName}
                  active={false} 
                  onClick={() => setSelectedVideo(item.video.videoUrl)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Container - Mobile */}
        <div
          ref={mobileScrollRef}
          className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {videos.map((item) => (
            <div key={item._id} className="snap-center shrink-0 w-[85vw] md:w-[45vw]">
              <VideoGalleryCard
                thumbnail={item.video.thumbnailUrl}
                title={item.video.videoName}
                active={false}
                onClick={() => setSelectedVideo(item.video.videoUrl)}
              />
            </div>
          ))}
        </div>

        {/* Mobile Arrows/Pagination */}
        <div className="flex lg:hidden items-center justify-center gap-4 mt-8">
          <button
            onClick={handleMobilePrevBtn}
            disabled={mobileIdx === 0}
            className={`w-9 h-9 rounded-full border flex items-center justify-center
              ${mobileIdx > 0 ? "border-green-600 text-green-600" : "border-gray-200 text-gray-300"}`}
          >
            <FiChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-400 tabular-nums">
            {mobileIdx + 1} / {videos.length}
          </span>
          <button
            onClick={handleMobileNextBtn}
            disabled={mobileIdx >= videos.length - 1}
            className={`w-9 h-9 rounded-full border flex items-center justify-center
              ${mobileIdx < videos.length - 1 ? "border-green-600 text-green-600" : "border-gray-200 text-gray-300"}`}
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}