"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { PosterAdCard } from "./poster-ad-card";
import { Button } from "@/components/ui/button";

interface PosterAdCarouselProps {
  ads: any[];
  maxAds?: number;
}

export function PosterAdCarousel({ ads, maxAds = 3 }: PosterAdCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const limitedAds = ads.slice(0, maxAds);

  const nextSlide = useCallback(() => {
    if (limitedAds.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % limitedAds.length);
  }, [limitedAds.length]);

  const prevSlide = useCallback(() => {
    if (limitedAds.length <= 1) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? limitedAds.length - 1 : prevIndex - 1
    );
  }, [limitedAds.length]);

  useEffect(() => {
    if (limitedAds.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide, limitedAds.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [ads]);

  if (!ads || ads.length === 0) {
    return null;
  }

  const currentAd = limitedAds[currentIndex];

  const Modal = ({
    open,
    onClose,
    ad,
  }: {
    open: boolean;
    onClose: () => void;
    ad: any;
  }) => {
    if (!open || !ad) return null;
    const imageUrl = `/api/images?imageName=${ad.image?.fileName}`;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={imageUrl}
            alt={ad.mainCategory?.name || "Ad image"}
            className="w-full h-auto max-h-[60vh] object-contain rounded mb-4"
          />
          <div className="w-full text-center space-y-2">
            <div className="text-lg font-semibold">{ad.mainCategory?.name}</div>
            <div className="text-sm text-gray-600">
              Location: {ad.city}
              {ad.state ? `, ${ad.state}` : ""}
            </div>
            <div className="text-sm text-gray-600">
              Posted by: {ad.postedBy || ad.customer?.user?.name || "Unknown"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div className="relative">
        <div
          className="w-full cursor-zoom-in"
          onClick={() => setModalOpen(true)}
        >
          <PosterAdCard ad={currentAd} className="h-full" />
        </div>
        {limitedAds.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 shadow-md hover:bg-white"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous slide</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 shadow-md hover:bg-white"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next slide</span>
            </Button>
          </>
        )}
      </div>
      {limitedAds.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {limitedAds.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </button>
          ))}
        </div>
      )}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        ad={currentAd}
      />
    </div>
  );
}
