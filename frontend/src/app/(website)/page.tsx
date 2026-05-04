"use client";

import api from "@/lib/api";
import { PosterAd } from "@/lib/types/posterAd";
import { useQueries } from "@tanstack/react-query";
import PosterVideoAdSides from "./components/poster-video-ad-sides";
import PosterAdCenterBottom from "./components/poster-ad-center-bottom";
import LineAds from "./components/line-ad/line-ads";
import { Suspense } from "react";
import Link from "next/link";

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
    <div>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Find What You Need
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Search through thousands of classified advertisements across Real Estate, Vehicles, Electronics, Jobs and more.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-lg bg-white text-slate-900 px-6 py-3 text-sm font-semibold shadow-lg hover:bg-slate-100 transition-colors"
            >
              Browse Ads
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Post an Ad
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-10 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Advertisements</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-5">
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
      </div>
    </div>
  );
}
