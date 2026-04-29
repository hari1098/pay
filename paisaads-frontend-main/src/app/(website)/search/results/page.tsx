"use client";

import api from "@/lib/api";
import { PosterAd } from "@/lib/types/posterAd";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PosterVideoAdSides from "../../components/poster-video-ad-sides";
import LineAdsWithPagination from "./line-ads-with-pagination";
import QuickSearchBar from "./quick-search";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";

export default function SearchResultsPage() {
  const [categoryId, setCategoryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [paramsReady, setParamsReady] = useState(false);
  const params = useSearchParams();

  useEffect(() => {
    const categoryId = params.get("categoryId");
    const stateId = params.get("stateId");
    const cityId = params.get("cityId");
    const countryId = params.get("countryId");

    if (categoryId) setCategoryId(categoryId);
    if (stateId) setStateId(stateId);
    if (cityId) setCityId(cityId);
    if (countryId) setCountryId(countryId);
    setParamsReady(true);
  }, [params]);

  const data = useQueries({
    queries: [
      {
        queryKey: ["search-line-ads", categoryId, stateId, cityId, countryId],
        queryFn: async () => {
          const params = new URLSearchParams();
          if (categoryId) params.append("categoryId", categoryId);
          if (stateId) params.append("stateId", stateId);
          if (cityId) params.append("cityId", cityId);
          if (countryId) params.append("countryId", countryId);

          const response = await api.get(`line-ad/today?${params.toString()}`);
          return response.data;
        },
        enabled: paramsReady,
      },
      {
        queryKey: ["search-video-ads", categoryId, stateId, cityId, countryId],
        queryFn: async () => {
          const params = new URLSearchParams();
          if (categoryId) params.append("categoryId", categoryId);
          if (stateId) params.append("stateId", stateId);
          if (cityId) params.append("cityId", cityId);
          if (countryId) params.append("countryId", countryId);

          const response = await api.get(`video-ad/today?${params.toString()}`);
          return response.data;
        },
        enabled: paramsReady,
      },
      {
        queryKey: ["search-poster-ads", categoryId, stateId, cityId, countryId],
        queryFn: async () => {
          const params = new URLSearchParams();
          if (categoryId) params.append("categoryId", categoryId);
          if (stateId) params.append("stateId", stateId);
          if (cityId) params.append("cityId", cityId);
          if (countryId) params.append("countryId", countryId);

          const response = await api.get(`poster-ad/today?${params.toString()}`);
          return response.data;
        },
        enabled: paramsReady,
      },
    ],
    combine(result) {
      const [lineAds, videoAds, posterAds] = result;

      const filteredPosterAds = posterAds.data?.filter((ad: PosterAd) => {
        return (
          ad.position?.side !== "CENTER_BOTTOM" &&
          ad.position?.side !== "CENTER_TOP"
        );
      });
      return {
        lineAds: lineAds.data || [],
        filteredPosterAds: filteredPosterAds || [],
        videoAds: videoAds.data || [],
        centerBottomPosterAd:
          posterAds.data?.find(
            (ad: PosterAd) => ad.position?.side === "CENTER_BOTTOM"
          ) || null,
        centerTopPosterAd:
          posterAds.data?.find(
            (ad: PosterAd) => ad.position?.side === "CENTER_TOP"
          ) || null,
      };
    },
  });

  const CenterContentWithSearch = () => {
    const tads = data.centerTopPosterAd ? [data.centerTopPosterAd] : [];
    const bads = data.centerBottomPosterAd ? [data.centerBottomPosterAd] : [];
    const totalTopAds = tads.length;
    const totalBottomAds = bads.length;
    const [currentTopAdIndex, setCurrentTopAdIndex] = useState(0);
    const [currentBottomAdIndex, setCurrentBottomAdIndex] = useState(0);

    return (
      <div className="col-span-8 flex flex-col gap-5">
        {tads && tads.length > 0 && (
          <div className="aspect-video overflow-hidden h-72 relative select-none">
            {currentTopAdIndex > 0 && (
              <ChevronLeftCircle
                className="cursor-pointer size-8 text-gray-800 absolute top-1/2 left-2 -translate-y-1/2 bg-white shadow-xl rounded-full z-10"
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
                className="cursor-pointer size-8 text-gray-800 absolute top-1/2 right-2 -translate-y-1/2 bg-white shadow-xl rounded-full z-10"
              />
            )}
            {totalTopAds > 1 && (
              <div className="pb-0.5 absolute bg-black px-3 bottom-2 rounded-full left-1/2 -translate-x-1/2 z-10">
                <span className="leading-none text-white text-xs">
                  {currentTopAdIndex + 1} / {totalTopAds}
                </span>
              </div>
            )}
            <div className="mb-4">
              <img
                src={`/api/images?imageName=${tads[currentTopAdIndex].image.fileName}`}
                alt={tads[currentTopAdIndex].mainCategory.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3">
          <QuickSearchBar />
        </div>

        <LineAdsWithPagination />

        {bads && bads.length > 0 && (
          <div className="aspect-video overflow-hidden h-72 relative select-none">
            {currentBottomAdIndex > 0 && (
              <ChevronLeftCircle
                className="cursor-pointer size-8 text-gray-800 absolute top-1/2 left-2 -translate-y-1/2 bg-white shadow-xl rounded-full z-10"
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
                className="cursor-pointer size-8 text-gray-800 absolute top-1/2 right-2 -translate-y-1/2 bg-white shadow-xl rounded-full z-10"
              />
            )}
            {totalBottomAds > 1 && (
              <div className="pb-0.5 absolute bg-black px-3 bottom-2 rounded-full left-1/2 -translate-x-1/2 z-10">
                <span className="leading-none text-white text-xs">
                  {currentBottomAdIndex + 1} / {totalBottomAds}
                </span>
              </div>
            )}
            <div className="mb-4">
              <img
                src={`/api/images?imageName=${bads[currentBottomAdIndex].image.fileName}`}
                alt={bads[currentBottomAdIndex].mainCategory.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pt-5 px-10 grid grid-cols-12 gap-5">
      <div className="col-span-2">
        <PosterVideoAdSides
          side="left"
          posterAds={data.filteredPosterAds}
          videoAds={data.videoAds}
        />
      </div>
      
      <CenterContentWithSearch />

      <div className="col-span-2">
        <PosterVideoAdSides
          side="right"
          posterAds={data.filteredPosterAds}
          videoAds={data.videoAds}
        />
      </div>
    </div>
  );
}
