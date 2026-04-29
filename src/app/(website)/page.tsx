"use client";

import api from "@/lib/api";
import { PosterAd } from "@/lib/types/posterAd";
import { useQueries } from "@tanstack/react-query";
import PosterVideoAdSides from "./components/poster-video-ad-sides";
import PosterAdCenterBottom from "./components/poster-ad-center-bottom";
import LineAds from "./components/line-ad/line-ads";
import { Suspense } from "react";

export default function Home() {
  const data = useQueries({
    queries: [
      {
        queryKey: ["line-ads"],
        queryFn: async () => {
          const response = await api.get("line-ad/today");
          return response.data;
        },
      },
      {
        queryKey: ["video-ads"],
        queryFn: async () => {
          const response = await api.get("video-ad/today");
          return response.data;
        },
      },
      {
        queryKey: ["poster-ads"],
        queryFn: async () => {
          const response = await api.get("poster-ad/today");
          return response.data;
        },
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
          posterAds.data?.filter(
            (ad: PosterAd) => ad.position?.side === "CENTER_BOTTOM"
          ) || null,
        centerTopPosterAd:
          posterAds.data?.filter(
            (ad: PosterAd) => ad.position?.side === "CENTER_TOP"
          ) || null,
      };
    },
  });

  return (
    <div className="pt-2 md:pt-5 px-2 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-5">
      <div className="hidden md:block md:col-span-2">
        <PosterVideoAdSides
          side="left"
          posterAds={data.filteredPosterAds}
          videoAds={data.videoAds}
        />
      </div>

      <div className="col-span-1 md:col-span-8">
        <PosterAdCenterBottom
          topAds={data.centerTopPosterAd}
          bottomAds={data.centerBottomPosterAd}
        >
          <Suspense fallback={null}>
            <LineAds />
          </Suspense>
        </PosterAdCenterBottom>
      </div>

      <div className="hidden md:block md:col-span-2">
        <PosterVideoAdSides
          side="right"
          posterAds={data.filteredPosterAds}
          videoAds={data.videoAds}
        />
      </div>

      <div className="md:hidden col-span-1 space-y-4">
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2 text-center">Featured Ads</h3>
          <PosterVideoAdSides
            side="left"
            posterAds={data.filteredPosterAds}
            videoAds={data.videoAds}
          />
        </div>
      </div>
    </div>
  );
}
