"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { AdStatus } from "@/lib/enum/ad-status";
import { LineAd } from "@/lib/types/lineAd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { columns } from "./columns";

export default function PublishedPosterAdsPage() {
  const queryClient = useQueryClient();
  const [selectedAd, setSelectedAd] = useState<LineAd | null>(null);
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["publishedPosterAds"],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/poster-ad/status/${AdStatus.PUBLISHED}`
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
          <h1 className="text-3xl font-bold">Published Poster Ads</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {ads.length} Published
          </Badge>
        </div>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No Ads Published</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There are currently no poster advertisements published.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={ads}
          searchColumn="dates"
          searchPlaceholder="Search content..."
        />
      )}

      <Dialog open={imagesDialogOpen} onOpenChange={setImagesDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Advertisement Images</DialogTitle>
            <DialogDescription>
              {selectedAd?.images?.length
                ? `${selectedAd.images.length} images attached to this advertisement`
                : "No images attached"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {selectedAd?.images?.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-md border"
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={image.fileName}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {!selectedAd?.images?.length && (
              <div className="col-span-2 flex items-center justify-center h-40 border border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">
                  No images available
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
