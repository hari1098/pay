"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, X, User, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Category {
  id: string;
  name: string;
  category_heading_font_color: string;
  isActive: boolean;
}

interface LineAdImage {
  id: string;
  fileName: string;
  filePath: string;
}

interface LineAd {
  id: string;
  content: string;
  mainCategory: Category;
  categoryOne: Category;
  categoryTwo: Category;
  categoryThree: Category;
  images: LineAdImage[];
  state: string;
  city: string;
  postedBy?: string;
  contactOne?: string;
  backgroundColor?: string;
  textColor?: string;
}

const ImageGallery = ({
  images,
  apiUrl,
}: {
  images: LineAdImage[];
  apiUrl: string | undefined;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="relative group h-full w-full">
        {images.length > 1 && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              );
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 flex items-center justify-center focus:outline-none"
            tabIndex={0}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {images.length > 1 && (
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
              );
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 flex items-center justify-center focus:outline-none"
            tabIndex={0}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <div
          className="w-full overflow-hidden cursor-pointer h-full"
          onClick={() => setShowLightbox(true)}
        >
          <img
            src={`/api/images/?imageName=${images[currentIndex].fileName}`}
            alt="Advertisement"
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {currentIndex + 1}/{images.length}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 p-2 bg-gradient-to-t from-black/50 to-transparent">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={cn(
                  "w-2 h-2 rounded-full transition-all cursor-pointer",
                  currentIndex === idx
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showLightbox} onOpenChange={setShowLightbox}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-4xl p-0 bg-black border-none">
          <div className="relative flex items-center justify-center min-h-[60vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
              onClick={() => setShowLightbox(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {images.length > 1 && (
              <button
                type="button"
                aria-label="Previous image"
                onClick={() =>
                  setCurrentIndex(
                    currentIndex === 0 ? images.length - 1 : currentIndex - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 flex items-center justify-center focus:outline-none"
                tabIndex={0}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {images.length > 1 && (
              <button
                type="button"
                aria-label="Next image"
                onClick={() =>
                  setCurrentIndex(
                    currentIndex === images.length - 1 ? 0 : currentIndex + 1
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 flex items-center justify-center focus:outline-none"
                tabIndex={0}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div className="flex items-center justify-center h-full w-full">
              <img
                src={`/api/images?imageName=${images[currentIndex].fileName}`}
                alt="Advertisement"
                className="w-[50vw] max-h-[80vh] object-contain mx-auto"
              />
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      currentIndex === idx
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/80"
                    )}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function LineAdCard({
  ad,
  index,
}: {
  ad: LineAd;
  index: number;
}) {
  const hasImages = ad.images && ad.images.length > 0;

  const getBadgeStyle = (category: Category | null) => {
    if (!category) return {};

    return {
      backgroundColor: category.category_heading_font_color || "#333",
      color: "white",
    };
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  };

  return (
    <Card 
      className="pt-0 pb-0 h-full flex flex-col overflow-hidden border rounded-lg break-inside-avoid hover:shadow-md transition-shadow duration-300"
      style={{
        backgroundColor: ad.backgroundColor || "#ffffff",
        color: ad.textColor || "#000000",
      }}
    >
      <div className="p-4 pt-3 pb-0 flex-grow">
        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3 text-xs opacity-80">
          {[ad.mainCategory, ad.categoryOne, ad.categoryTwo, ad.categoryThree]
            .filter(Boolean)
            .map((category, idx, arr) => (
              <span key={category.id || idx}>
                {category.name}
                {idx < arr.length - 1 && <span className="mx-1">|</span>}
              </span>
            ))}
        </div>

        <p className={cn("text-sm mb-2 text-justify")}>{ad.content}</p>

        <div className="space-y-1 pb-2 justify-between items-start">
          {(ad.postedBy || ad.contactOne) && (
            <div className="flex items-center text-xs opacity-80">
              <User className="h-3 w-3 mr-1" />
              <span>
                {ad.postedBy && ad.contactOne
                  ? `Posted by: ${ad.postedBy} / ${ad.contactOne}`
                  : ad.postedBy
                  ? `Posted by: ${ad.postedBy}`
                  : ad.contactOne
                  ? `Contact: ${ad.contactOne}`
                  : ""}
              </span>
            </div>
          )}

          <div className="flex items-center text-xs opacity-80">
            <MapPin className="h-3 w-3 mr-1" />
            {ad.city}, {ad.state}
          </div>
        </div>
      </div>

      {hasImages && (
        <div className=" w-full h-40">
          <ImageGallery
            images={ad.images}
            apiUrl={process.env.NEXT_PUBLIC_API_URL}
          />
        </div>
      )}
    </Card>
  );
}
