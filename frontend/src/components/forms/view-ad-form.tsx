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
  Tag,
  UserIcon,
} from "lucide-react";
import api from "@/lib/api";
import Zoom from "react-medium-image-zoom";
import { groupDatesByDay, getMonthName, getStatusVariant } from "@/lib/utils";
import type { LineAd } from "@/lib/types/lineAd";
import type { PosterAd } from "@/lib/types/posterAd";
import type { VideoAd } from "@/lib/types/videoAd";

type AdType = "line" | "poster" | "video";
export type AdData = LineAd | PosterAd | VideoAd;

interface ViewAdFormProps {
  adId: string;
  adType: AdType;
}

export function ViewAdForm({ adId, adType }: ViewAdFormProps) {
  const router = useRouter();

  const getEndpoint = () => {
    switch (adType) {
      case "line":
        return `/line-ad/${adId}`;
      case "poster":
        return `/poster-ad/${adId}`;
      case "video":
        return `/video-ad/${adId}`;
      default:
        throw new Error("Invalid ad type");
    }
  };

  const getBackRoute = () => {
    switch (adType) {
      case "line":
        return "/dashboard/my-ads/line-ads";
      case "poster":
        return "/dashboard/my-ads/poster-ads";
      case "video":
        return "/dashboard/my-ads/video-ads";
      default:
        return "/dashboard/my-ads";
    }
  };

  const getAdTitle = () => {
    switch (adType) {
      case "line":
        return "Line Ad Details";
      case "poster":
        return "Poster Ad";
      case "video":
        return "Video Ad";
      default:
        return "Ad Details";
    }
  };

  const {
    data: ad,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ad", adId, adType],
    queryFn: async () => {
      const response = await api.get<AdData>(getEndpoint());
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-2">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load advertisement data.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const groupedDates = groupDatesByDay(ad.dates);

  const currentMonth =
    groupedDates.length > 0
      ? `${getMonthName(groupedDates[0].date)}`
      : "No dates";

  const isLineAd = (ad: AdData): ad is LineAd => adType === "line";
  const isPosterAd = (ad: AdData): ad is PosterAd => adType === "poster";
  const isVideoAd = (ad: AdData): ad is VideoAd => adType === "video";

  const getImages = () => {
    if (isLineAd(ad)) {
      return ad.images || [];
    } else if (isPosterAd(ad) || isVideoAd(ad)) {
      return ad.image ? [ad.image] : [];
    }
    return [];
  };

  const getContent = () => {
    if (isLineAd(ad)) {
      return ad.content;
    }
    return "";
  };

  const getCategories = () => {
    const categories = [ad.mainCategory];
    if ("categoryOne" in ad && ad.categoryOne)
      categories.push(ad.categoryOne as any);
    if ("categoryTwo" in ad && ad.categoryTwo)
      categories.push(ad.categoryTwo as any);
    if ("categoryThree" in ad && ad.categoryThree)
      categories.push(ad.categoryThree as any);
    return categories;
  };

  const getPositionInfo = () => {
    if (isPosterAd(ad) || isVideoAd(ad)) {
      return ad.position;
    }
    return null;
  };

  const images = getImages();
  const content = getContent();
  const categories = getCategories();
  const positionInfo = getPositionInfo();

  return (
    <div className="px-2 py-">
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(getBackRoute())}
              className="hover:bg-gray-100 text-xs px-2 py-1"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back
            </Button>
            <div className="h-4 w-px bg-gray-300"></div>
            <h1 className="text-sm font-semibold px-2 py-1 text-white bg-black rounded">
              {getAdTitle()}
            </h1>
          </div>
          {ad.status && (
            <Badge

              variant={getStatusVariant(ad.status) as any}
              className="uppercase text-xs px-2 py-1"
            >
              {ad.status === "FOR_REVIEW"
                ? "Review"
                : ad.status.replace(/_/g, " ")}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2 space-y-3">
            <Card className="p-3 border rounded-lg shadow-sm">
              <div className="space-y-3">
                {content && (
                  <div>
                    <h2 className="text-sm font-semibold mb-2 flex items-center">
                      <div className="w-0.5 h-4 bg-black rounded-full mr-2"></div>
                      Ad Content
                    </h2>
                    <div className="bg-gray-50 rounded p-3 border-l-2 border-black">
                      <p className="text-xs leading-relaxed text-gray-900">
                        {content}
                      </p>
                    </div>
                  </div>
                )}

                {(isPosterAd(ad) || isVideoAd(ad)) && (
                  <div>
                    <h2 className="text-sm font-semibold mb-2 flex items-center">
                      <div className="w-0.5 h-4 bg-black rounded-full mr-2"></div>
                      Ad {adType === "video" ? "Video" : "Image"}
                    </h2>
                    <div className="space-y-3">
                      {adType === "video" ? (
                        <div className="h-96 w-full border rounded-md overflow-hidden bg-gray-50">
                          <video
                            src={`/api/images?imageName=${ad.image.fileName}`}
                            className="w-full h-full object-cover"
                            controls
                            muted
                            autoPlay
                          />
                        </div>
                      ) : (
                        <div className="h-52 w-full border rounded-md overflow-hidden bg-gray-50">
                          <Zoom>
                            <img
                              src={`/api/images?imageName=${ad.image.fileName}`}
                              alt={`Ad ${adType}`}
                              className="w-full h-full object-cover"
                            />
                          </Zoom>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-600 mb-2">
                    <span className="font-medium">Created:</span>{" "}
                    {format(new Date(ad.created_at), "MMM do, yyyy")}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <MapPin className="h-3 w-3 mr-1 text-gray-500 flex-shrink-0" />
                      <span className="font-medium text-xs">
                        {ad.city}, {ad.state}
                      </span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <UserIcon className="h-3 w-3 mr-1 text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600">By:</span>
                        <div className="font-medium">{ad.postedBy}</div>
                      </div>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <Phone className="h-3 w-3 mr-1 text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600">Contact:</span>
                        <div className="font-medium">
                          {isLineAd(ad)
                            ? ad.contactTwo ?? ad.contactOne
                            : "Owner"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center mb-2">
                    <Tag className="h-3 w-3 mr-2 text-gray-600" />
                    <h3 className="text-sm font-medium">Categories</h3>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {categories.map((category, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 text-xs font-medium"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {isLineAd(ad) && images.length > 0 && (
              <Card className="p-3 border rounded-lg shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-0.5 h-4 bg-black rounded-full mr-2"></div>
                    <h3 className="text-sm font-semibold">Images</h3>
                    <span className="ml-2 text-xs text-gray-500">
                      ({images.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <Zoom key={image.id || index}>
                        <div className="aspect-w-16 aspect-h-9 border rounded overflow-hidden bg-gray-50 hover:shadow-md transition-shadow cursor-pointer">
                          <img
                            src={`/api/images?imageName=${image.fileName}`}
                            alt={`Ad image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/image.png";
                            }}
                          />
                        </div>
                      </Zoom>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-3">
            <Card className="p-3 border rounded-lg shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-2 text-gray-600" />
                  <h3 className="text-sm font-semibold">Publication Dates</h3>
                </div>

                {groupedDates.length > 0 ? (
                  <div className="space-y-1">
                    <div className="bg-black text-white px-2 py-0.5 rounded text-center text-xs font-medium">
                      {currentMonth}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="grid grid-cols-4 gap-0.5">
                        {groupedDates.map((dateInfo, index) => (
                          <div
                            key={index}
                            className="text-center p-0.5 bg-gray-50 rounded"
                          >
                            <div className="text-xs font-semibold text-gray-900">
                              {dateInfo.day}
                            </div>
                            <div className="text-[10px] text-gray-600">
                              {dateInfo.dayName.slice(0, 3)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <Calendar className="h-4 w-4 text-gray-300 mx-auto mb-1" />
                    <p className="text-gray-500 text-xs">No dates</p>
                  </div>
                )}
              </div>
            </Card>

            {positionInfo && (
              <Card className="p-3 border rounded-lg shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-2 text-gray-600" />
                    <h3 className="text-sm font-semibold">Ad Position</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2 bg-gray-50 rounded flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">
                        Page Type:
                      </span>
                      <span className="font-semibold">
                        {positionInfo.pageType === "HOME"
                          ? "Home Page"
                          : "Category Page"}
                      </span>
                    </div>

                    <div className="p-2 bg-gray-50 rounded flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">
                        Position Type:
                      </span>
                      <span className="font-semibold">
                        {positionInfo.side
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>

                    {(positionInfo.side === "LEFT_SIDE" ||
                      positionInfo.side === "RIGHT_SIDE") && (
                      <div className="p-2 bg-gray-50 rounded flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">
                          Position Number:
                        </span>
                        <span className="font-semibold">
                          Position {positionInfo.position}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

          </div>

          {ad.payment && (
            <Card className="p-3 border rounded-lg shadow-sm">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                  Payment Info
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                    <span className="text-gray-600 font-medium">Method:</span>
                    <span className="font-semibold">
                      {ad.payment.method.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                    <span className="text-gray-600 font-medium">Amount:</span>
                    <span className="font-semibold">₹{ad.payment.amount}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                    <span className="text-gray-600 font-medium">
                      Reference:
                    </span>
                    <span className="font-semibold">
                      {ad.payment.details || "upi id"}
                    </span>
                  </div>
                </div>

                {ad.payment.proof && (
                  <div className="pt-2 border-t">
                    <div className="text-gray-600 font-medium mb-2 text-xs">
                      Payment Proof:
                    </div>
                    <Zoom>
                      <div className="w-full mx-auto overflow-hidden rounded border hover:shadow-md transition-shadow cursor-pointer">
                        <img
                          src={`/api/images?imageName=${ad.payment.proof.fileName}&loadProof=true`}
                          alt="Payment proof"
                          className="w-full h-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/image.png";
                          }}
                        />
                      </div>
                    </Zoom>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(getBackRoute())}
              className="px-4 py-2 border hover:bg-gray-50 text-xs"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back to My Ads
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
