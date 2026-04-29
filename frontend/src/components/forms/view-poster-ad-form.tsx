"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  ImageIcon,
  MapPin,
  Phone,
  PhoneCall,
  Tag,
  UserIcon,
} from "lucide-react";
import api from "@/lib/api";
import Zoom from "react-medium-image-zoom";
import { PosterAd } from "@/lib/types/posterAd";
import { groupDatesByDay, getMonthName, getStatusVariant } from "@/lib/utils";

export function ViewPosterAdForm({ adId }: { adId: string }) {
  const router = useRouter();

  const {
    data: ad,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ad", adId],
    queryFn: async () => {
      const response = await api.get<PosterAd>(`/poster-ad/${adId}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !ad) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load advertisement data.</AlertDescription>
      </Alert>
    );
  }

  const groupedDates = groupDatesByDay(ad.dates);

  const currentMonth =
    groupedDates.length > 0
      ? `${getMonthName(groupedDates[0].date)}`
      : "No dates";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/my-ads/poster-ads")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className=" font-medium px-3 py-1 text-white bg-black rounded">
            Poster Ad
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <Card className="p-6 border rounded-md">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-medium">Ad Content</h2>
                {ad.status && (
                  <Badge

                    variant={getStatusVariant(ad.status) as any}
                    className="uppercase"
                  >
                    {ad.status === "FOR_REVIEW"
                      ? "For Review"
                      : ad.status.replace(/_/g, " ")}
                  </Badge>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                Created: {format(new Date(ad.created_at), "MMMM do, yyyy")}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  {ad.city}, {ad.state}
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-1">Posted by:</span>{" "}
                  Owner
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border rounded-md">
            <div className="space-y-4">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <h3 className="font-medium">Categories</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                >
                  {ad.mainCategory.name}
                </Badge>
                {ad.categoryOne && (
                  <Badge
                    variant="outline"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                  >
                    {ad.categoryOne.name}
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 border rounded-md">
            <div className="space-y-4">
              <div className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" />
                <h3 className="font-medium">Image</h3>
              </div>

              <div className="h-52 w-full border rounded-md overflow-hidden bg-gray-50">
                <Zoom>
                  <img
                    src={`/api/images?imageName=${ad.image.fileName}`}
                    alt={`Ad image`}
                    className="w-full  object-cover"
                  />
                </Zoom>
              </div>

            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6 border rounded-md">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <h3 className="font-medium">Publication Dates</h3>
              </div>

              {groupedDates.length > 0 ? (
                <div>
                  <h4 className="font-medium mb-2">{currentMonth}</h4>
                  <div className="flex flex-wrap gap-2">
                    {groupedDates.map((dateInfo, index) => (
                      <div key={index} className="text-center">
                        <div className="text-sm">
                          {dateInfo.day} {dateInfo.dayName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No publication dates</p>
              )}
            </div>
          </Card>

          <Card className="p-6 border rounded-md">
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <h3 className="font-medium">Ad Position</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Page Type</span>
                  </div>
                  <span className="font-medium">
                    {ad.position.pageType === 'HOME' ? 'Home Page' : 'Category Page'}
                  </span>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Position Type</span>
                  </div>
                  <span className="font-medium">
                    {ad.position.side.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>

                {(ad.position.side === 'LEFT_SIDE' || ad.position.side === 'RIGHT_SIDE') && (
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Position Number</span>
                    </div>
                    <span className="font-medium">Position {ad.position.position}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {ad.payment && (
            <Card className="p-6 border rounded-md">
              <div className="space-y-4">
                <h3 className="font-medium">Payment Information</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span>
                      {ad.payment.method.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span>₹{ad.payment.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference:</span>
                    <span>{ad.payment.details || "upi id"}</span>
                  </div>

                  {ad.payment.proof && (
                    <div>
                      <div className="text-muted-foreground mb-1">
                        Payment Proof:
                      </div>
                      <div className="size-32 overflow-hidden">
                        <Zoom>
                          <img
                            src={`/api/images?imageName=${ad.payment.proof.fileName}&loadProof=true`}
                            alt="Payment proof"
                            className="h-full w-full max-w-sm rounded-md"
                          />
                        </Zoom>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
