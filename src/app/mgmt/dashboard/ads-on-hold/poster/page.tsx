"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { AdStatus } from "@/lib/enum/ad-status";
import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { columns } from "./columns";

export default function AdsOnHoldPosterAdsPage() {

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["adsOnHoldPosterAds"],
    queryFn: async () => {
      try {
        const response = await api.get(`/poster-ad/status/${AdStatus.HOLD}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching poster ads on hold:", error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-8 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Poster Ads On Hold</h1>
          <p className="text-muted-foreground mt-1">
            Manage poster advertisements that are currently on hold
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {ads.length} On Hold
          </Badge>
        </div>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No Poster Ads On Hold</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There are currently no poster advertisements on hold.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={ads}
          searchColumn="dates"
          searchPlaceholder="Search dates..."
        />
      )}
    </div>
  );
}
