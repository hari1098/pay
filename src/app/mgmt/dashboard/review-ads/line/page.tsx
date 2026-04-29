"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { AdStatus } from "@/lib/enum/ad-status";
import { LineAd } from "@/lib/types/lineAd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { columns } from "./columns";

export default function ReviewLineAdsPage() {
  const queryClient = useQueryClient();

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["reviewLineAds"],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/line-ad/status/${AdStatus.FOR_REVIEW},${AdStatus.YET_TO_BE_PUBLISHED},${AdStatus.HOLD}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching ads:", error);
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
          <h1 className="text-3xl font-bold">Review Line Ads</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {ads.length} Pending Review
          </Badge>
        </div>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No Ads Pending Review</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There are currently no line advertisements waiting for review.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={ads}
          searchColumn="content"
          searchPlaceholder="Search content..."
        />
      )}
    </div>
  );
}
