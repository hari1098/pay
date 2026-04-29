import { PosterAd } from "@/lib/types/posterAd";
import { VideoAd, AdPosition } from "@/lib/types/videoAd";
import { useState } from "react";

interface PosterVideoAdSidesProps {
  videoAds?: VideoAd[];
  posterAds?: PosterAd[];
  side: "left" | "right";
}

function VideoAdCard({ ad }: { ad: VideoAd }) {
  if (!ad || !ad.image?.fileName) return null;

  const mainCategory = ad.mainCategory?.name || "";
  const location =
    ad.city && ad.state ? `${ad.city}, ${ad.state}` : ad.city || ad.state || "";

  const videoUrl = `/api/images?imageName=${ad.image.fileName}`;

  return (
    <div className="relative overflow-hidden rounded-lg shadow-md group w-full aspect-[4/5] md:aspect-[1/1.2]">
      <div className="relative h-full w-full overflow-hidden bg-gray-200">
        <video
          key={ad.id}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          playsInline
          preload="metadata"
          controls

        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          <img
            src={videoUrl}
            alt={mainCategory || "Video Ad"}
            className="object-cover w-full h-full"
          />
        </video>

        {mainCategory && (
          <div
            className="absolute top-2 right-2 rounded-full px-3 py-1 text-xs font-medium z-10"
            style={{
              backgroundColor: ad.mainCategory?.categories_color || "#8B5CF6",
              color: ad.mainCategory?.font_color || "white",
            }}
          >
            {mainCategory}
          </div>
        )}

        {location && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 rounded px-2 py-1 text-xs text-white z-10">
            <svg
              className="w-3 h-3 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {location}
          </div>
        )}
      </div>
    </div>
  );
}

function EnhancedPosterAdCard({ ad }: { ad: PosterAd }) {
  if (!ad || !ad.image?.fileName) return null;

  const mainCategory = ad.mainCategory?.name || "";
  const location =
    ad.city && ad.state ? `${ad.city}, ${ad.state}` : ad.city || ad.state || "";

  const imageUrl = `/api/images?imageName=${ad.image.fileName}`;

  return (
    <div className="relative overflow-hidden rounded-lg shadow-md group w-full aspect-[4/5] md:aspect-[1/1.2]">
      <div className="relative h-full w-full overflow-hidden">
        <img
          key={ad.id}
          src={imageUrl || "/placeholder.svg"}
          alt={`${mainCategory}`.trim() || "Advertisement"}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            console.error("Image load error:", e);
          }}
        />

        {mainCategory && (
          <div
            className="absolute top-2 right-2 rounded-full px-3 py-1 text-xs font-medium z-10"
            style={{
              backgroundColor: ad.mainCategory?.categories_color || "#10B981",
              color: ad.mainCategory?.font_color || "white",
            }}
          >
            {mainCategory}
          </div>
        )}

        {location && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 rounded px-2 py-1 text-xs text-white z-10">
            <svg
              className="w-3 h-3 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {location}
          </div>
        )}
      </div>
    </div>
  );
}

function AdCarousel({ ads, positionName }: { ads: Array<{ type: 'video' | 'poster', ad: VideoAd | PosterAd }>, positionName: string | number }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (ads.length === 0) return null;

  const nextAd = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const prevAd = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const currentAd = ads[currentIndex];

  return (
    <div className="relative w-full">
      <div className="w-full">
        {currentAd?.type === "video" ? (
          <VideoAdCard ad={currentAd.ad as VideoAd} />
        ) : (
          <EnhancedPosterAdCard ad={currentAd?.ad as PosterAd} />
        )}
      </div>

      {ads.length > 1 && (
        <>
          <button
            onClick={prevAd}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-20 transition-colors"
            aria-label="Previous ad"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextAd}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-20 transition-colors"
            aria-label="Next ad"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PosterVideoAdSides({
  videoAds = [],
  posterAds = [],
  side,
}: PosterVideoAdSidesProps) {

  if (!videoAds && !posterAds) {
    return <div className="flex items-center flex-col gap-5"></div>;
  }

  const positions = [1, 2, 3, 4, 5, 6];
  const targetSide = side === "left" ? "LEFT_SIDE" : "RIGHT_SIDE";

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getAdsForPosition = (positionNum: number) => {
    const positionAds: Array<{ type: 'video' | 'poster', ad: VideoAd | PosterAd }> = [];

    const videoAdsForPosition = videoAds?.filter((ad) =>
      ad.position?.side === targetSide && ad.position?.position === positionNum
    ) || [];
    videoAdsForPosition.forEach(ad => {
      positionAds.push({ type: 'video', ad });
    });

    const posterAdsForPosition = posterAds?.filter((ad) =>
      ad.position?.side === targetSide && ad.position?.position === positionNum
    ) || [];
    posterAdsForPosition.forEach(ad => {
      positionAds.push({ type: 'poster', ad });
    });

    const shuffledAds = shuffleArray(positionAds);

    return shuffledAds.slice(0, 5);
  };

  const adsGroupedByPosition = positions.map(positionNum => ({
    position: positionNum,
    ads: getAdsForPosition(positionNum)
  })).filter(group => group.ads.length > 0);

  console.log(`${side} side ads:`, {
    videoAdsCount: videoAds?.length || 0,
    posterAdsCount: posterAds?.length || 0,
    positionGroups: adsGroupedByPosition.length,
    totalAdsToRender: adsGroupedByPosition.reduce((sum, group) => sum + group.ads.length, 0),
  });

  if (adsGroupedByPosition.length === 0) {
    return <div className="flex items-center flex-col gap-5"></div>;
  }

  return (
    <div className="flex items-center flex-col md:gap-5 gap-3">
      <div className="md:hidden w-full overflow-x-auto">
        <div className="flex gap-3 pb-2" style={{ width: `${adsGroupedByPosition.length * 250}px` }}>
          {adsGroupedByPosition.slice(0, 6).map((positionGroup, groupIndex) => (
            <div key={`${side}-${positionGroup.position}-${groupIndex}`} className="min-w-[240px] flex-shrink-0">
              <AdCarousel
                ads={positionGroup.ads}
                positionName={`${targetSide}-${positionGroup.position}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:flex md:flex-col md:gap-5 md:items-center">
        {adsGroupedByPosition.map((positionGroup, groupIndex) => (
          <div key={`${side}-${positionGroup.position}-${groupIndex}`} className="w-full">
            <AdCarousel
              ads={positionGroup.ads}
              positionName={`${targetSide}-${positionGroup.position}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
