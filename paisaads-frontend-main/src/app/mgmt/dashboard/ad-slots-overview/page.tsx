"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Grid,
  Filter,
  Layout,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import AdSlotsApi from "@/lib/services/ad-slots-api";
import {
  DateBasedAdSlotsOverview,
  DateBasedLineAds,
  DateBasedSlotDetails,
  DateBasedSlotOccupancy,
  DateBasedLineAd,
  DateBasedSlotAdDetail,
  PageTypeFilter,
  Category,
} from "@/lib/types/ad-slots";

export default function AdSlotsOverviewPage() {
  const [pageTypeFilter, setPageTypeFilter] = useState<PageTypeFilter>("HOME");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(() => {

    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] =
    useState<DateBasedSlotOccupancy | null>(null);
  const [slotDetailsOpen, setSlotDetailsOpen] = useState(false);

  const { data: availableDates } = useQuery({
    queryKey: ["availableDates"],
    queryFn: async () => {
      const response = await AdSlotsApi.getAvailableDates();
      return response;
    },
  });

  useEffect(() => {
    if (
      availableDates &&
      availableDates.dates.length > 0 &&
      !availableDates.dates.includes(selectedDate)
    ) {

      setSelectedDate(availableDates.dates[availableDates.dates.length - 1]);
    }
  }, [availableDates, selectedDate]);

  const {
    data: slotsData,
    isLoading: slotsLoading,
    error: slotsError,
  } = useQuery({
    queryKey: [
      "adSlotsByDate",
      selectedDate,
      pageTypeFilter !== "ALL" ? pageTypeFilter : undefined,
      selectedCategory || undefined,
    ],
    queryFn: async () => {
      const response = await AdSlotsApi.getAdSlotsByDate(
        selectedDate,
        pageTypeFilter !== "ALL" ? pageTypeFilter : undefined,
        selectedCategory || undefined
      );
      return response;
    },
    enabled: !!selectedDate,
  });

  const { data: lineAdsData, isLoading: lineAdsLoading } = useQuery({
    queryKey: [
      "lineAdsByDate",
      selectedDate,
      pageTypeFilter !== "ALL" ? pageTypeFilter : undefined,
      selectedCategory || undefined,
    ],
    queryFn: async () => {
      const response = await AdSlotsApi.getLineAdsByDate(
        selectedDate,
        pageTypeFilter !== "ALL" ? pageTypeFilter : undefined,
        selectedCategory || undefined
      );
      return response;
    },
    enabled: !!selectedDate,
  });

  const { data: slotDetails, isLoading: slotDetailsLoading } = useQuery({
    queryKey: [
      "slotDetailsByDate",
      selectedDate,
      selectedSlot?.pageType,
      selectedSlot?.side,
      selectedSlot?.position,
    ],
    queryFn: async () => {
      if (!selectedSlot) return null;

      const response = await AdSlotsApi.getSlotDetailsByDate(
        selectedDate,
        selectedSlot.pageType,
        selectedSlot.side,
        selectedSlot.position,
        selectedCategory || undefined
      );
      return response;
    },
    enabled: !!selectedSlot && slotDetailsOpen && !!selectedDate,
  });

  const availableCategories = useMemo(() => {
    if (!slotsData) return [];
    return slotsData.categories;
  }, [slotsData]);

  const handleSlotClick = (slot: DateBasedSlotOccupancy) => {
    setSelectedSlot(slot);
    setSlotDetailsOpen(true);
  };

  const getSlotStatusColor = (slot: DateBasedSlotOccupancy) => {
    if (!slot.isOccupied) {
      return "bg-green-50 border-green-200 text-green-700 hover:bg-green-100";
    }

    if (slot.activeAdsCount >= slot.maxCapacity) {
      return "bg-red-50 border-red-200 text-red-700 hover:bg-red-100";
    }

    return "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100";
  };

  const getSlotStatus = (
    slot: DateBasedSlotOccupancy
  ): "FREE" | "PARTIALLY_OCCUPIED" | "FULL" => {
    if (!slot.isOccupied) return "FREE";
    if (slot.activeAdsCount >= slot.maxCapacity) return "FULL";
    return "PARTIALLY_OCCUPIED";
  };

  const getStatusBadgeColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "EXPIRED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryBadgeColor = (category: Category | undefined) => {
    if (!category) return "bg-gray-100 text-gray-800";
    if (category.color) {

      return `bg-[${category.color}]/10 text-[${category.color}]`;
    }
    return "bg-blue-100 text-blue-800";
  };

  const handlePreviousDate = () => {
    if (!availableDates || availableDates.dates.length === 0) return;
    const currentIndex = availableDates.dates.indexOf(selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(availableDates.dates[currentIndex - 1]);
    }
  };

  const handleNextDate = () => {
    if (!availableDates || availableDates.dates.length === 0) return;
    const currentIndex = availableDates.dates.indexOf(selectedDate);
    if (currentIndex < availableDates.dates.length - 1) {
      setSelectedDate(availableDates.dates[currentIndex + 1]);
    }
  };

  useEffect(() => {
    if (pageTypeFilter !== "CATEGORY") {
      setSelectedCategory("");
    }
  }, [pageTypeFilter]);

  if (slotsLoading) {
    return <AdSlotsOverviewSkeleton />;
  }

  if (slotsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Failed to load ad slots overview</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 px-4 md:pt-5 md:px-10">
      {slotsData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    Total Slots
                  </p>
                  <p className="text-xl md:text-2xl font-bold">{slotsData.totalSlots}</p>
                </div>
                <Layout className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    Free Slots
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    {slotsData.freeSlots}
                  </p>
                </div>
                <div className="h-6 w-6 md:h-8 md:w-8 bg-green-500 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    Occupied Slots
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-red-600">
                    {slotsData.occupiedSlots}
                  </p>
                </div>
                <div className="h-6 w-6 md:h-8 md:w-8 bg-red-500 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs md:text-sm font-medium">Date Navigation:</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousDate}
              disabled={
                !availableDates ||
                availableDates.dates.indexOf(selectedDate) === 0
              }
              className="px-2 md:px-3"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="flex-1 text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableDates?.dates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextDate}
              disabled={
                !availableDates ||
                availableDates.dates.indexOf(selectedDate) ===
                  availableDates.dates.length - 1
              }
              className="px-2 md:px-3"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs md:text-sm font-medium">Page Type:</span>
          </div>
          <Select
            value={pageTypeFilter}
            onValueChange={(value: PageTypeFilter) => setPageTypeFilter(value)}
          >
            <SelectTrigger className="text-xs md:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOME">Home Page</SelectItem>
              <SelectItem value="CATEGORY">Category Pages</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs md:text-sm font-medium">Category:</span>
          </div>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            disabled={pageTypeFilter !== "CATEGORY"}
          >
            <SelectTrigger className="text-xs md:text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-5">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="flex items-center gap-2 text-lg md:text-xl">
                  <Grid className="h-4 w-4 md:h-5 md:w-5" />
                  Ad Slots
                </span>
                <Badge variant="outline" className="text-xs w-fit">
                  <span className="hidden sm:inline">
                    {selectedDate &&
                      new Date(selectedDate + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                  </span>
                  <span className="sm:hidden">
                    {selectedDate &&
                      new Date(selectedDate + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                  </span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {slotsData && slotsData.slots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {slotsData.slots.map((slot) => {
                    const status = getSlotStatus(slot);
                    return (
                      <Card
                        key={`${slot.pageType}-${slot.side}-${slot.position}`}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${getSlotStatusColor(
                          slot
                        )}`}
                        onClick={() => handleSlotClick(slot)}
                      >
                        <CardContent className="p-3 md:p-4">
                          <div className="space-y-2 md:space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm md:text-sm font-medium">
                                Pos {slot.position}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {status.replace("_", " ")}
                              </Badge>
                            </div>

                            <div className="text-xs text-muted-foreground">
                              <span className="hidden sm:inline">
                                {slot.pageType} - {slot.side?.replace("_", " ")}
                              </span>
                              <span className="sm:hidden">
                                {slot.pageType}
                              </span>
                            </div>

                            {slot.categories && slot.categories.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                <div className="sm:hidden flex flex-wrap gap-1">
                                  {slot.categories.slice(0, 1).map((cat) => (
                                    <Badge
                                      key={cat.id}
                                      className={`text-xs ${getCategoryBadgeColor(
                                        cat
                                      )}`}
                                    >
                                      {cat.name.length > 8 ? cat.name.substring(0, 6) + "..." : cat.name}
                                    </Badge>
                                  ))}
                                  {slot.categories.length > 1 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{slot.categories.length - 1}
                                    </Badge>
                                  )}
                                </div>
                                <div className="hidden sm:flex flex-wrap gap-1">
                                  {slot.categories.slice(0, 2).map((cat) => (
                                    <Badge
                                      key={cat.id}
                                      className={`text-xs ${getCategoryBadgeColor(
                                        cat
                                      )}`}
                                    >
                                      {cat.name}
                                    </Badge>
                                  ))}
                                  {slot.categories.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{slot.categories.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="text-xs text-muted-foreground">
                              {slot.activeAdsCount}/{slot.maxCapacity} ads
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                              <div
                                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                                  status === "FREE"
                                    ? "bg-green-500"
                                    : status === "PARTIALLY_OCCUPIED"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: `${
                                    (slot.activeAdsCount / slot.maxCapacity) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Grid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No ad slots found for {selectedDate}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-1">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Line Ads ({lineAdsData?.totalCount || 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {lineAdsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : lineAdsData ? (
                <div className="space-y-2 md:space-y-3">
                  {[...lineAdsData.homeAds, ...lineAdsData.categoryAds]
                    .slice(0, 6)
                    .map((ad) => (
                      <Card
                        key={ad.id}
                        className="hover:shadow-sm transition-shadow"
                      >
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="font-medium text-xs md:text-sm line-clamp-1">
                              {ad.title}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {ad.content}
                            </div>

                            {ad.mainCategory && (
                              <Badge
                                className={`text-xs ${getCategoryBadgeColor(
                                  ad.mainCategory
                                )}`}
                              >
                                <span className="hidden sm:inline">{ad.mainCategory.name}</span>
                                <span className="sm:hidden">
                                  {ad.mainCategory.name.length > 8 
                                    ? ad.mainCategory.name.substring(0, 8) + "..." 
                                    : ad.mainCategory.name}
                                </span>
                              </Badge>
                            )}

                            <div className="flex items-center justify-between">
                              <Badge className={`${getStatusBadgeColor(ad.status)} text-xs`}>
                                {ad.status}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {ad.pageType}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No line ads found for {selectedDate}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={slotDetailsOpen} onOpenChange={setSlotDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mx-4 md:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              <span className="hidden md:inline">
                Slot Details - {selectedSlot?.pageType} Page,{" "}
                {selectedSlot?.side?.replace("_", " ")}, Position{" "}
                {selectedSlot?.position}
              </span>
              <span className="md:hidden">
                {selectedSlot?.pageType} - Pos {selectedSlot?.position}
              </span>
            </DialogTitle>
          </DialogHeader>

          {slotDetailsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : slotDetails ? (
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Current Occupancy
                  </p>
                  <p className="text-xl md:text-2xl font-bold">
                    {slotDetails.currentOccupancy}/{slotDetails.maxCapacity}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs md:text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className="text-xs">
                    {slotDetails.currentOccupancy === 0
                      ? "FREE"
                      : slotDetails.currentOccupancy >= slotDetails.maxCapacity
                      ? "FULL"
                      : "PARTIALLY OCCUPIED"}
                  </Badge>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs md:text-sm text-muted-foreground">Total Ads</p>
                  <p className="text-lg md:text-xl font-bold">{slotDetails.ads.length}</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <h4 className="text-base md:text-lg font-semibold">
                  Active Ads in this Slot
                </h4>
                {slotDetails.ads.length > 0 ? (
                  <div className="space-y-2 md:space-y-3">
                    {slotDetails.ads.map((ad, index) => (
                      <Card key={`${ad.id}-${index}`}>
                        <CardContent className="p-3 md:p-4">
                          <div className="md:hidden space-y-2">
                            <div className="font-medium text-sm">{ad.title}</div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">{ad.adType}</Badge>
                              <Badge className={`${getStatusBadgeColor(ad.status)} text-xs`}>
                                {ad.status}
                              </Badge>
                              {ad.mainCategory && (
                                <Badge
                                  className={`text-xs ${getCategoryBadgeColor(
                                    ad.mainCategory
                                  )}`}
                                >
                                  {ad.mainCategory.name.length > 8 
                                    ? ad.mainCategory.name.substring(0, 8) + "..." 
                                    : ad.mainCategory.name}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {ad.isActive ? "Active" : "Inactive"}
                            </div>
                          </div>
                          
                          <div className="hidden md:grid grid-cols-5 gap-4 items-center">
                            <div className="col-span-2">
                              <span className="font-medium">{ad.title}</span>
                              {ad.mainCategory && (
                                <div className="mt-1">
                                  <Badge
                                    className={`text-xs ${getCategoryBadgeColor(
                                      ad.mainCategory
                                    )}`}
                                  >
                                    {ad.mainCategory.name}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div>
                              <Badge variant="outline">{ad.adType}</Badge>
                            </div>
                            <div>
                              <Badge className={getStatusBadgeColor(ad.status)}>
                                {ad.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {ad.isActive ? "Active" : "Inactive"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 md:py-8">
                    <p className="text-muted-foreground text-sm">
                      No ads in this slot on {selectedDate}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 md:py-8">
              <p className="text-red-600 text-sm">Failed to load slot details</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdSlotsOverviewSkeleton() {
  return (
    <div className="pt-4 px-4 md:pt-5 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 md:h-4 w-16 md:w-20" />
                  <Skeleton className="h-5 md:h-6 w-10 md:w-12" />
                </div>
                <Skeleton className="h-6 w-6 md:h-8 md:w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 md:h-4 w-16 md:w-20 mb-2" />
            <Skeleton className="h-9 md:h-10 w-full" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-5">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <Skeleton className="h-5 md:h-6 w-24 md:w-32" />
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-3 md:p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-3 md:h-4 w-10 md:w-12" />
                          <Skeleton className="h-4 md:h-5 w-12 md:w-16" />
                        </div>
                        <Skeleton className="h-3 w-16 md:w-20" />
                        <Skeleton className="h-3 w-12 md:w-16" />
                        <Skeleton className="h-1.5 md:h-2 w-full rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="xl:col-span-1">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <Skeleton className="h-5 md:h-6 w-24 md:w-32" />
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-2 md:space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 md:h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
