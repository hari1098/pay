export interface DashboardStats {
  totalAds: number;
  statusCounts: {
    DRAFT: number;
    FOR_REVIEW: number;
    REJECTED: number;
    HOLD: number;
    YET_TO_BE_PUBLISHED: number;
    PUBLISHED: number;
    PAUSED: number;
  };
  ads: Array<any>; 
}
