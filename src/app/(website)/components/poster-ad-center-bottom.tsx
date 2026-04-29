import { PosterAd } from "@/lib/types/posterAd";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { useState } from "react";

export default function PosterAdCenterBottom({
  children,
  topAds,
  bottomAds,
}: {
  children: React.ReactNode;
  topAds: PosterAd[];
  bottomAds: PosterAd[];
}) {
  const tads = topAds || [];
  const bads = bottomAds || [];
  const totalTopAds = tads.length;
  const totalBottomAds = bads?.length;
  const [currentTopAdIndex, setCurrentTopAdIndex] = useState(0);
  const [currentBottomAdIndex, setCurrentBottomAdIndex] = useState(0);
  console.log('tads', tads, bads)

  return (
    <div className="col-span-8 flex flex-col gap-5">
      <div className="aspect-video overflow-hidden h-72 relative select-none">
        {currentTopAdIndex > 0 && (
          <ChevronLeftCircle
            className="cursor-pointer size-8 text-gray-800 absolute top-1/2 left-2 -translate-y-1/2 bg-white shadow-xl rounded-full"
            onClick={() => {
              setCurrentTopAdIndex(
                (currentTopAdIndex - 1 + totalTopAds) % totalTopAds
              );
            }}
          />
        )}
        {currentTopAdIndex < totalTopAds - 1 && (
          <ChevronRightCircle
            onClick={() => {
              setCurrentTopAdIndex((currentTopAdIndex + 1) % totalTopAds);
            }}
            className="cursor-pointer size-8 text-gray-800 absolute top-1/2 right-2 -translate-y-1/2 bg-white shadow-xl rounded-full"
          />
        )}
        {tads && tads.length > 0 ? (
          <div className="pb-0.5 absolute bg-black px-3 bottom-2 rounded-full left-1/2 -translate-x-1/2">
            <span className="leading-none text-white text-xs">
              {currentTopAdIndex + 1} / {totalTopAds}
            </span>
          </div>
        ) : (
          <></>
        )}
        {tads && tads.length > 0 ? (
          <div className="mb-4">
            <img
              src={`/api/images?imageName=${topAds[currentTopAdIndex].image.fileName}`}
              alt={topAds[currentTopAdIndex].mainCategory.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      {children}
      <div className="aspect-video overflow-hidden h-72 relative select-none">
        {currentBottomAdIndex > 0 && (
          <ChevronLeftCircle
            className="cursor-pointer size-8 text-gray-800 absolute top-1/2 left-2 -translate-y-1/2 bg-white shadow-xl rounded-full"
            onClick={() => {
              setCurrentBottomAdIndex(
                (currentBottomAdIndex - 1 + totalBottomAds) % totalBottomAds
              );
            }}
          />
        )}
        {currentBottomAdIndex < totalBottomAds - 1 && (
          <ChevronRightCircle
            onClick={() => {
              setCurrentBottomAdIndex(
                (currentBottomAdIndex + 1) % totalBottomAds
              );
            }}
            className="cursor-pointer size-8 text-gray-800 absolute top-1/2 right-2 -translate-y-1/2 bg-white shadow-xl rounded-full"
          />
        )}
        {bads && bads.length > 0 ? (
          <div className="pb-0.5 absolute bg-black px-3 bottom-2 rounded-full left-1/2 -translate-x-1/2">
            <span className="leading-none text-white text-xs">
              {currentBottomAdIndex + 1} / {totalBottomAds}
            </span>
          </div>
        ) : (
          <></>
        )}
        {bads && bads.length > 0 ? (
          <div className="mb-4">
            <img
              src={`/api/images?imageName=${bottomAds[currentBottomAdIndex].image.fileName}`}
              alt={bottomAds[currentBottomAdIndex].mainCategory.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
