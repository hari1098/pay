"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdStatus } from "@/lib/enum/ad-status";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RecentAdsListProps {
  ads: Array<any>;
}

export function RecentAdsList({ ads }: RecentAdsListProps) {

  const recentAds = ads
    .filter((ad) => ad.status !== AdStatus.DRAFT)
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 5);

  function getStatusVariant(status: AdStatus) {
    switch (status) {
      case AdStatus.DRAFT:
        return "warning";
      case AdStatus.FOR_REVIEW:
        return "info";
      case AdStatus.REJECTED:
        return "destructive";
      case AdStatus.HOLD:
        return "secondary";
      case AdStatus.YET_TO_BE_PUBLISHED:
        return "outline";
      case AdStatus.PUBLISHED:
        return "success";
      case AdStatus.PAUSED:
        return "default";
      default:
        return "default";
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Ads</CardTitle>
        <Link
          href="/mgmt/dashboard/review-ads/line"
          className="text-sm text-primary flex items-center"
        >
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {recentAds.length > 0 ? (
          <div className="space-y-4">
            {recentAds.map((ad) => (
              <div key={ad.id} className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {ad.images && ad.images.length > 0 ? (
                    <Image
                      src={`/api/images?imageName=${ad.images[0].fileName}`}
                      alt={`Ad ${ad.sequenceNumber}`}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/mgmt/dashboard/review-ads/line/view/${ad.id}`}
                      className="font-medium text-sm hover:underline truncate"
                    >
                      {ad.content.length > 40
                        ? `${ad.content.substring(0, 40)}...`
                        : ad.content}
                    </Link>
                    <Badge
                      variant={getStatusVariant(ad.status) as any}
                      className="ml-2"
                    >
                      {ad.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>#{ad.sequenceNumber}</span>
                    <span className="mx-1">•</span>
                    <span>{ad.mainCategory?.name}</span>
                    <span className="mx-1">•</span>
                    <span>
                      {formatDistanceToNow(new Date(ad.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No ads available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
