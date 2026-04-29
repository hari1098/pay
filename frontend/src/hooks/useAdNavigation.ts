import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { AdType } from "@/lib/enum/ad-type";
import { getBackRoute, parseNavigationContext, type AdStatusPage } from "@/lib/navigation";

export function useAdNavigation(adType: AdType, adId: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const navigationContext = parseNavigationContext(searchParams, adType, adId);
  
  const goBack = useCallback(() => {
    const backRoute = getBackRoute(navigationContext.from, adType);
    router.push(backRoute);
  }, [navigationContext.from, adType, router]);
  
  const goToStatus = useCallback((statusPage: AdStatusPage) => {
    const statusRoute = getBackRoute(statusPage, adType);
    router.push(statusRoute);
  }, [adType, router]);
  
  return {
    goBack,
    goToStatus,
    from: navigationContext.from,
    isFromReviewAds: navigationContext.from === 'review-ads',
    isFromPublishedAds: navigationContext.from === 'published-ads',
    isFromAdsOnHold: navigationContext.from === 'ads-on-hold',
    isFromRejectedAds: navigationContext.from === 'rejected-ads'
  };
}