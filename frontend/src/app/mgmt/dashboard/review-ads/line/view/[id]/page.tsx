"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { AdType } from "@/lib/enum/ad-type";
import { formatOrderId, getStatusVariant } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  Tag,
  User,
  Layout,
  Monitor,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Zoom from "react-medium-image-zoom";

export default function ViewLineAd() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const params = useParams();

  const {
    data: ad,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lineAd", params.id],
    queryFn: async () => {
      const response = await api.get(`/line-ad/${params.id}`);
      return response.data;
    },
  });

  const groupDatesByMonth = (dates: string[]) => {
    if (!dates || dates.length === 0) return [];

    const datesByMonth: Record<string, Date[]> = {};
    const sortedDates = [...dates]
      .map((dateStr) => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());

    sortedDates.forEach((date) => {
      const monthYear = format(date, "MMMM yyyy");
      if (!datesByMonth[monthYear]) {
        datesByMonth[monthYear] = [];
      }
      datesByMonth[monthYear].push(date);
    });

    return Object.entries(datesByMonth).map(([monthYear, datesInMonth]) => {
      return {
        monthYear,
        dates: datesInMonth,
      };
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading ad details...</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Failed to load ad details</h3>
            <p className="text-gray-600">Please try again later</p>
          </div>
          <Button
            onClick={() => router.push("/mgmt/dashboard/review-ads/line")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Line Ads
          </Button>
        </div>
      </div>
    );
  }

  const groupedDates = groupDatesByMonth(ad.dates);
  const hasImages = ad.images && ad.images.length > 0;
  const customer = ad.customer;

  return (
    <div className="h-screen overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border mb-4 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"

                onClick={() => router.back()}
                className="h-8 px-3"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>

              <div>
                <h1 className="text-lg font-bold">
                  {formatOrderId(ad.sequenceNumber, AdType.LINE)}
                </h1>
                <p className="text-xs text-gray-500">
                  {format(new Date(ad.created_at), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={getStatusVariant(ad.status) as any}
                className="text-xs px-2 py-1"
              >
                {ad.status.replace(/_/g, " ")}
              </Badge>

              <Button asChild size="sm" className="h-8 px-3">
                <Link
                  href={`/mgmt/dashboard/review-ads/line/edit/${params.id}`}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
          <div className="space-y-4">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Ad Content
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="text-sm font-medium leading-relaxed">
                  {ad.content}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  <MapPin className="h-3 w-3" />
                  {ad.city}, {ad.state}
                </div>

                <Separator className="my-2" />

                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Tag className="h-3 w-3" />
                    Categories
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {ad.mainCategory.name}
                    </Badge>
                    {ad.categoryOne && (
                      <>
                        <span className="text-gray-300 text-xs">›</span>
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5 bg-green-50 text-green-700 border-green-200"
                        >
                          {ad.categoryOne.name}
                        </Badge>
                      </>
                    )}
                    {ad.categoryTwo && (
                      <>
                        <span className="text-gray-300 text-xs">›</span>
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 border-purple-200"
                        >
                          {ad.categoryTwo.name}
                        </Badge>
                      </>
                    )}
                    {ad.categoryThree && (
                      <>
                        <span className="text-gray-300 text-xs">›</span>
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5 bg-orange-50 text-orange-700 border-orange-200"
                        >
                          {ad.categoryThree.name}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="flex items-center gap-2 text-xs bg-gray-50 px-2 py-1 rounded">
                  <User className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600">Posted by:</span>
                  <span className="font-medium">{ad.postedBy}</span>
                </div>

                <Separator className="my-2" />

                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Layout className="h-3 w-3" />
                    Position Information
                  </div>
                  <div className="flex items-center gap-2 text-xs bg-blue-50 px-2 py-1 rounded border border-blue-200">
                    <Monitor className="h-3 w-3 text-blue-600" />
                    <span className="text-blue-700 font-medium">
                      {ad.pageType === 'HOME' ? 'Home Page' : 'Category Pages'} - Line Ads Section
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {hasImages && (
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-2 px-4">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4 text-green-600" />
                    Images ({ad.images.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {ad.images.map((image: any, index: number) => (
                      <div
                        key={image.id || index}
                        className="aspect-square relative rounded-md overflow-hidden border bg-gray-50 cursor-pointer shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <Zoom>
                          <Image
                            src={`/api/images?imageName=${image.fileName}`}
                            alt={`Ad image ${index + 1}`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/colorful-abstract-flow.png";
                            }}
                          />
                        </Zoom>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-2 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <User className="h-4 w-4 text-purple-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {customer ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">Name</div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          <User className="h-3 w-3 text-gray-400" />
                          {customer.user?.name || "N/A"}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">Phone</div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {customer.user?.phone_number || "N/A"}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">Email</div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {customer.user?.email || "N/A"}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">
                          Location
                        </div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {customer.city}, {customer.state}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No customer information available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 pb-2 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Phone className="h-4 w-4 text-orange-600" />
                  Contact Numbers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="bg-gray-50 p-2 rounded-md">
                  <div className="text-xs text-gray-500 mb-1">
                    Primary Contact
                  </div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-3 w-3 text-gray-400" />
                    {ad?.contactOne || "N/A"}
                  </div>
                </div>

                <div className="bg-gray-50 p-2 rounded-md">
                  <div className="text-xs text-gray-500 mb-1">
                    Secondary Contact
                  </div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-3 w-3 text-gray-400" />
                    {ad?.contactTwo && ad?.contactTwo !== 0
                      ? ad?.contactTwo
                      : "N/A"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-2 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  Publication Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {groupedDates.length > 0 ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {groupedDates.map((group, groupIndex) => (
                      <div key={groupIndex} className="space-y-2">
                        <div className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {group.monthYear}
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {group.dates.map((date, dateIndex) => (
                            <Badge
                              key={dateIndex}
                              variant="outline"
                              className="text-xs px-1 py-0.5 bg-blue-50 text-blue-700 border-blue-200 justify-center"
                            >
                              {format(date, "d")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No publication dates specified
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 pb-2 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {ad.payment ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">Method</div>
                        <div className="text-sm font-medium capitalize">
                          {ad.payment.method.replace(/_/g, " ")}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">Amount</div>
                        <div className="text-sm font-medium text-green-700">
                          ₹{ad.payment.amount}
                        </div>
                      </div>
                    </div>

                    {ad.payment.details && (
                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">
                          Reference
                        </div>
                        <div className="text-sm font-medium">
                          {ad.payment.details}
                        </div>
                      </div>
                    )}

                    {ad.payment.proof && (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">
                          Payment Proof
                        </div>
                        <div className="w-20 h-20 relative rounded-md overflow-hidden border bg-gray-50 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                          <Zoom>
                            <Image
                              src={`/api/images?imageName=${ad.payment.proof.fileName}`}
                              alt="Payment proof"
                              fill
                              className="object-cover"
                            />
                          </Zoom>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No payment information available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
