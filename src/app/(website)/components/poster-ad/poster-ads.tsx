"use client";

import type React from "react";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PosterAdCarousel } from "./poster-ad-carousel";
import api from "@/lib/api";

export default function PosterAds({ children }: { children: React.ReactNode }) {
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

  const { data, isLoading } = useQuery({
    queryKey: ["posterAds", new Date().getDate(), categoryId, stateId, cityId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      if (stateId) params.append("stateId", stateId);
      if (cityId) params.append("cityId", cityId);

      const { data } = await api.get(`/poster-ad/today?${params.toString()}`);
      return data;
    },
    enabled: paramsReady,
  });

  const shuffleArray = (array: any[]) => {
    if (!array) return [];
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const allAds = data || [];
  const maxAdsPerCarousel = 3; 

  const centerTopAds = allAds.filter(
    (ad: any) => ad.position?.side === 'CENTER_TOP'
  );
  const centerBottomAds = allAds.filter(
    (ad: any) => ad.position?.side === 'CENTER_BOTTOM'
  );

  const topAds = shuffleArray(centerTopAds).slice(0, maxAdsPerCarousel);
  const bottomAds = shuffleArray(centerBottomAds).slice(0, maxAdsPerCarousel);

  return (
    <div>
      {topAds.length > 0 && (
        <div className=" w-full">
          <PosterAdCarousel ads={topAds} maxAds={maxAdsPerCarousel} />
        </div>
      )}
      {children}
      {}{" "}
      {bottomAds.length > 0 && (
        <div className=" w-full">
          <PosterAdCarousel ads={bottomAds} maxAds={maxAdsPerCarousel} />
        </div>
      )}
    </div>
  );
}
