import { AdType } from "./enum/ad-type";

export type AdStatusPage = 'review-ads' | 'published-ads' | 'ads-on-hold' | 'rejected-ads';

export interface NavigationContext {
  from?: AdStatusPage;
  adType: AdType;
  adId: string;
}

export function getStatusPageRoute(statusPage: AdStatusPage, adType: AdType): string {
  const adTypeMap = {
    [AdType.POSTER]: 'poster',
    [AdType.LINE]: 'line', 
    [AdType.VIDEO]: 'video'
  };

  return `/mgmt/dashboard/${statusPage}/${adTypeMap[adType]}`;
}

export function getEditRoute(statusPage: AdStatusPage, adType: AdType, adId: string): string {
  const basePage = statusPage === 'review-ads' ? 'review-ads' : 'review-ads'; 
  const adTypeMap = {
    [AdType.POSTER]: 'poster',
    [AdType.LINE]: 'line', 
    [AdType.VIDEO]: 'video'
  };

  return `/mgmt/dashboard/${basePage}/${adTypeMap[adType]}/edit/${adId}?from=${statusPage}`;
}

export function getBackRoute(from: AdStatusPage | undefined, adType: AdType): string {
  if (!from) {

    return getStatusPageRoute('review-ads', adType);
  }
  
  return getStatusPageRoute(from, adType);
}

export function parseNavigationContext(searchParams: URLSearchParams, adType: AdType, adId: string): NavigationContext {
  const from = searchParams.get('from') as AdStatusPage | null;
  
  return {
    from: from || undefined,
    adType,
    adId
  };
}