"use client";

import type React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import type { VideoAd } from "@/lib/types/videoAd";
import type { PosterAd } from "@/lib/types/posterAd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LineAds from "../line-ad/line-ads";
import dynamic from "next/dynamic";
import PosterAds from "../poster-ad/poster-ads";
import Zoom from "react-medium-image-zoom";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

type Ad = VideoAd | PosterAd;

const SAMPLE_VIDEO =
  "https://videos.pexels.com/video-files/4678261/4678261-hd_1080_1920_25fps.mp4";

const SAMPLE_POSTERS = [
  "https://picsum.photos/400/711?random=1", 
  "https://picsum.photos/400/711?random=2",
  "https://picsum.photos/400/711?random=3",
  "https://picsum.photos/400/711?random=4",
  "https://picsum.photos/400/711?random=5",
];

const SAMPLE_CATEGORIES = [
  { name: "Fashion & Clothing", color: "#dc2626" },
  { name: "Electronics & Technology", color: "#2563eb" },
  { name: "Automotive", color: "#7c3aed" },
  { name: "Home & Garden", color: "#059669" },
  { name: "Health & Beauty", color: "#db2777" },
];

const SAMPLE_LOCATIONS = [
  "Mumbai, Maharashtra",
  "Delhi, Delhi",
  "Bangalore, Karnataka",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
];

function shuffleArray<T>(array: T[]): T[] {
  if (!array || array.length === 0) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface PositionAdProps {
  ads: Ad[];
  side: string;
  positionNumber: number;
  maxAds?: number;
  className?: string;
}

const PositionAd: React.FC<PositionAdProps> = ({
  ads,
  side,
  positionNumber,
  maxAds = 5,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [videoKey, setVideoKey] = useState(0); 
  const [randomizedAds, setRandomizedAds] = useState<Ad[]>([]);

  useEffect(() => {
    setMounted(true);
    setShowVideo(positionNumber % 2 === 0);

    if (ads && ads.length > 0) {
      setRandomizedAds(shuffleArray(ads).slice(0, maxAds));
    } else {
      setRandomizedAds([]);
    }
  }, [side, positionNumber, ads, maxAds]);

  useEffect(() => {
    setVideoKey((prev) => prev + 1);
  }, [currentIndex]);

  if (!randomizedAds || randomizedAds.length === 0) {
    const posterIndex = positionNumber % SAMPLE_POSTERS.length;
    const categoryIndex = positionNumber % SAMPLE_CATEGORIES.length;
    const locationIndex = positionNumber % SAMPLE_LOCATIONS.length;

    if (!mounted) {
      return (
        <div className="relative w-full h-full group rounded-md overflow-hidden shadow bg-gray-200 dark:bg-gray-700 animate-pulse">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full group rounded-md overflow-hidden shadow bg-white dark:bg-gray-800 hover:scale-[1.01]">
        {showVideo ? (
          <div className="relative w-full h-full overflow-hidden bg-black">
            {mounted && (
              <ReactPlayer
                key={`sample-${videoKey}`}
                url={SAMPLE_VIDEO}
                width="100%"
                height="100%"
                controls
                light={false}
                pip
                playing={false}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                      disablePictureInPicture: false,
                      style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    },
                  },
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                wrapper={(props) => (
                  <div {...props} style={{ width: "100%", height: "100%" }} />
                )}
              />
            )}
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="absolute top-2 right-2 flex flex-col gap-1 max-w-[calc(50%-1rem)]">
                <Badge
                  className="text-xs pointer-events-auto hover:scale-105 transition-transform duration-200 shadow-md backdrop-blur-sm"
                  style={{
                    backgroundColor: SAMPLE_CATEGORIES[categoryIndex].color,
                    color: "white",
                  }}
                >
                  {SAMPLE_CATEGORIES[categoryIndex].name}
                </Badge>
              </div>
              <Badge className="absolute bottom-12 left-2 bg-black/70 text-white text-xs backdrop-blur-sm shadow-md">
                📍 {SAMPLE_LOCATIONS[locationIndex]}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={SAMPLE_POSTERS[posterIndex] || "/placeholder.svg"}
              alt="Sample Poster"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none">
              <div className="absolute top-2 right-2 flex flex-col gap-1 max-w-[calc(50%-1rem)]">
                <Badge
                  className="text-xs pointer-events-auto hover:scale-105 transition-transform duration-200 shadow-md backdrop-blur-sm"
                  style={{
                    backgroundColor: SAMPLE_CATEGORIES[categoryIndex].color,
                    color: "white",
                  }}
                >
                  {SAMPLE_CATEGORIES[categoryIndex].name}
                </Badge>
              </div>
              <Badge className="absolute bottom-2 left-2 bg-black/70 text-white text-xs backdrop-blur-sm shadow-md">
                📍 {SAMPLE_LOCATIONS[locationIndex]}
              </Badge>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentAd = randomizedAds[currentIndex];
  const isVideo =
    currentAd.image?.fileName?.endsWith(".mp4") ||
    currentAd.image?.fileName?.endsWith(".webm") ||
    currentAd.image?.fileName?.endsWith(".mov");
  const mediaUrl = `/api/images?imageName=${currentAd.image?.fileName}`;

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? randomizedAds.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === randomizedAds.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full h-full group rounded-md shadow overflow-hidden">
      {randomizedAds.length > 1 && (
        <>
          <Button
            onClick={goToPrevious}
            size="icon"
            variant="ghost"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-md hover:scale-105 w-8 h-8"
            aria-label="Previous ad"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={goToNext}
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-md hover:scale-105 w-8 h-8"
            aria-label="Next ad"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {randomizedAds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white scale-125 shadow-sm"
                    : "bg-white/50 hover:bg-white/80 hover:scale-110"
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {isVideo ? (
        <div className="relative w-full h-full overflow-hidden bg-black">
          {mounted && (
            <ReactPlayer
              key={`video-${currentIndex}-${videoKey}`} 
              url={mediaUrl}
              width="100%"
              height="100%"
              controls
              light={false}
              pip
              playing={false}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload",
                    disablePictureInPicture: false,
                    style: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  },
                },
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              wrapper={(props) => (
                <div {...props} style={{ width: "100%", height: "100%" }} />
              )}
            />
          )}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-2 py-1 text-xs text-white font-medium bg-black/60 z-30 rounded-t-md">
            <span className="truncate max-w-[60%]">
              {currentAd.mainCategory?.name}
            </span>
            <span className="ml-2 whitespace-nowrap text-white font-medium">
              {currentAd.city && currentAd.state
                ? `${currentAd.city}, ${currentAd.state}`
                : currentAd.city || currentAd.state || ""}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <Zoom>
            <img
              src={mediaUrl || "/placeholder.svg"}
              alt={`${currentAd.mainCategory?.name} - ${
                currentAd.categoryOne?.name || ""
              }`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </Zoom>

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-2 py-1 text-xs text-white font-medium bg-black/60 z-30 rounded-t-md">
            <span className="truncate max-w-[60%]">
              {currentAd.mainCategory?.name}
            </span>
            <span className="ml-2 whitespace-nowrap text-white font-medium">
              {currentAd.city && currentAd.state
                ? `${currentAd.city}, ${currentAd.state}`
                : currentAd.city || currentAd.state || ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function VideoPosterAd({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categoryId, setCategoryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [paramsReady, setParamsReady] = useState(false);
  const params = useSearchParams();

  useEffect(() => {
    const categoryId = params.get("categoryId");
    const stateId = params.get("stateId");
    const cityId = params.get("cityId");

    if (categoryId) setCategoryId(categoryId);
    if (stateId) setStateId(stateId);
    if (cityId) setCityId(cityId);
    setParamsReady(true);
  }, [params]);

  const { data: videoData } = useQuery({
    queryKey: ["videoAds", new Date().getDate(), categoryId, stateId, cityId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      if (stateId) params.append("stateId", stateId);
      if (cityId) params.append("cityId", cityId);

      const { data } = await api.get(`/video-ad/today?${params.toString()}`);
      return data as VideoAd[];
    },
    enabled: paramsReady,
  });

  const { data: posterData } = useQuery({
    queryKey: ["posterAds", new Date().getDate(), categoryId, stateId, cityId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      if (stateId) params.append("stateId", stateId);
      if (cityId) params.append("cityId", cityId);

      const { data } = await api.get(`/poster-ad/today?${params.toString()}`);
      return data as PosterAd[];
    },
    enabled: paramsReady,
  });

  const allAds = [...(videoData || []), ...(posterData || [])].filter(
    (ad) =>
      ad.position?.side !== 'CENTER_TOP' &&
      ad.position?.side !== 'CENTER_BOTTOM'
  );

  console.log("All ads after filtering:", allAds);
  console.log("Video ads:", videoData?.length || 0);
  console.log("Poster ads:", posterData?.length || 0);

  const adsByPosition: Record<string, Ad[]> = {};

  const positionKeys = [];
  for (let i = 1; i <= 6; i++) {
    positionKeys.push(`LEFT_SIDE_${i}`);
    positionKeys.push(`RIGHT_SIDE_${i}`);
  }

  positionKeys.forEach((key) => {
    adsByPosition[key] = [];
  });

  if (allAds.length > 0) {
    allAds.forEach((ad) => {
      if (ad.position?.side && ad.position?.position) {
        const positionKey = `${ad.position.side}_${ad.position.position}`;
        if (adsByPosition[positionKey]) {
          adsByPosition[positionKey].push(ad);
        }
      }
    });
  }

  const renderAdSlot = (side: string, positionNumber: number) => {
    const positionKey = `${side}_${positionNumber}`;
    const positionAds = adsByPosition[positionKey] || [];
    console.log(
      `Position ${positionKey}:`,
      positionAds.length,
      "ads",
      positionAds
    );
    return (
      <div className="w-full h-full relative">
        <PositionAd
          ads={positionAds}
          side={side}
          positionNumber={positionNumber}
          maxAds={10}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    );
  };

  return (
    <div className=" py-5 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-5 max-w-[1800px] mx-auto w-full px-2 md:px-4">
      <div className="col-span-2 space-y-3">
        <div className="col-span-2 h-[calc(100vh-65px)] min-h-0 grid grid-cols-2 md:grid-cols-1 gap-3 overflow-hidden">
          {[1, 2, 3].map((positionNumber) => (
            <div
              key={`LEFT_SIDE_${positionNumber}`}
              className="flex-1 min-h-0 w-full max-w-full overflow-hidden"
            >
              {renderAdSlot('LEFT_SIDE', positionNumber)}
            </div>
          ))}
        </div>
        <div className="col-span-2 h-[calc(100vh-65px)] min-h-0  grid grid-cols-2 md:grid-cols-1 gap-3 overflow-hidden">
          {[4, 5, 6].map((positionNumber) => (
            <div
              key={`LEFT_SIDE_${positionNumber}`}
              className="flex-1 min-h-0 w-full max-w-full overflow-hidden"
            >
              {renderAdSlot('LEFT_SIDE', positionNumber)}
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-8 w-full ">
        {children}
        <PosterAds>
          <LineAds />
        </PosterAds>
        {children}
      </div>

      <div className="col-span-2 space-y-3">
        <div className="col-span-2 h-[calc(100vh-65px)] min-h-0 grid grid-cols-2 md:grid-cols-1 gap-3 overflow-hidden">
          {[1, 2, 3].map((positionNumber) => (
            <div
              key={`RIGHT_SIDE_${positionNumber}`}
              className="flex-1 min-h-0 w-full max-w-full overflow-hidden"
            >
              {renderAdSlot('RIGHT_SIDE', positionNumber)}
            </div>
          ))}
        </div>
        <div className="col-span-2 h-[calc(100vh-65px)] min-h-0 grid grid-cols-2 md:grid-cols-1 gap-3 overflow-hidden">
          {[4, 5, 6].map((positionNumber) => (
            <div
              key={`RIGHT_SIDE_${positionNumber}`}
              className="flex-1 min-h-0 w-full max-w-full overflow-hidden"
            >
              {renderAdSlot('RIGHT_SIDE', positionNumber)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
