"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { EyeIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getStatusVariant, truncateContent } from "@/lib/utils";
import { AdType } from "@/lib/enum/ad-type";
import { ReportsFilters } from "./page";

interface SimpleReportsTableProps {
  filters: ReportsFilters;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 10;

export function SimpleReportsTable({ filters, currentPage, onPageChange }: SimpleReportsTableProps) {

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (filters.adType) params.set("adType", filters.adType);
    if (filters.status) params.set("status", filters.status);
    if (filters.startDate) params.set("startDate", format(filters.startDate, "yyyy-MM-dd"));
    if (filters.endDate) params.set("endDate", format(filters.endDate, "yyyy-MM-dd"));
    if (filters.state) params.set("state", filters.state);
    if (filters.city) params.set("city", filters.city);
    if (filters.userType) params.set("userType", filters.userType);
    if (filters.mainCategory) params.set("mainCategoryId", filters.mainCategory);
    if (filters.categoryOne) params.set("categoryOneId", filters.categoryOne);
    if (filters.categoryTwo) params.set("categoryTwoId", filters.categoryTwo);
    if (filters.categoryThree) params.set("categoryThreeId", filters.categoryThree);
    
    params.set("page", currentPage.toString());
    params.set("limit", ITEMS_PER_PAGE.toString());
    
    return params.toString();
  };

  const hasActiveFilters = Boolean(
    filters.adType || filters.status || filters.startDate ||
    filters.endDate ||
    filters.state ||
    filters.city ||
    filters.userType ||
    filters.mainCategory
  );

  interface QueryResult {
    items: any[];
    total: number;
    totalPages: number;
  }

  const { data, isLoading, error } = useQuery<QueryResult>({
    queryKey: ["simple-reports", filters, currentPage],
    queryFn: async (): Promise<QueryResult> => {
      const queryParams = buildQueryParams();
      const { data } = await api.get(`/reports/filtered-ads?${queryParams}`);

      return {
        items: data.data,
        total: data.totalCount,
        totalPages: data.totalPages,
      };
    },
    enabled: hasActiveFilters,
  });

  const getViewLink = (ad: any) => {
    switch (filters.adType) {
      case AdType.LINE:
        return `/mgmt/dashboard/review-ads/line/view/${ad.id}`;
      case AdType.POSTER:
        return `/mgmt/dashboard/review-ads/poster/view/${ad.id}`;
      case AdType.VIDEO:
        return `/mgmt/dashboard/review-ads/video/view/${ad.id}`;
      default:

        if (ad.content !== undefined) return `/mgmt/dashboard/review-ads/line/view/${ad.id}`;
        if (ad.image && ad.dates) return `/mgmt/dashboard/review-ads/video/view/${ad.id}`;
        if (ad.image) return `/mgmt/dashboard/review-ads/poster/view/${ad.id}`;
        return `/mgmt/dashboard/review-ads/line/view/${ad.id}`;
    }
  };

  const getAdImage = (ad: any) => {
    if (filters.adType === AdType.LINE) {
      return ad.images && ad.images.length > 0 ? ad.images[0] : null;
    } else if (filters.adType === AdType.POSTER || filters.adType === AdType.VIDEO) {
      return ad.image;
    }

    if (ad.images && ad.images.length > 0) return ad.images[0];
    if (ad.image) return ad.image;
    return null;
  };

  const getAdContent = (ad: any) => {
    if (ad.content) return truncateContent(ad.content, 100);
    if (filters.adType === AdType.POSTER) return "Poster Advertisement";
    if (filters.adType === AdType.VIDEO) return "Video Advertisement";
    return "No content available";
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (!hasActiveFilters) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Filters Applied</CardTitle>
          <CardDescription>
            Please apply at least one filter above to view ads data. Start by selecting an ad type.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading ads data. Please try again or contact support if the issue persists.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || !data.items || data.items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Results Found</CardTitle>
          <CardDescription>
            No ads match your current filter criteria. Try adjusting your filters.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-0">
      <Card className="shadow-sm">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-2xl font-bold">Results ({data.total})</CardTitle>
          <CardDescription className="text-sm md:text-base text-muted-foreground">
            Page {currentPage} of {data.totalPages} • {data.total} total results
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-3 lg:p-4">Seq #</TableHead>
                  <TableHead className="p-3 lg:p-4">Content</TableHead>
                  <TableHead className="p-3 lg:p-4">Status</TableHead>
                  <TableHead className="p-3 lg:p-4">Categories</TableHead>
                  <TableHead className="p-3 lg:p-4">Location</TableHead>
                  <TableHead className="p-3 lg:p-4">Customer</TableHead>
                  <TableHead className="p-3 lg:p-4">Created</TableHead>
                  <TableHead className="p-3 lg:p-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((ad: any) => {
                  const image = getAdImage(ad);
  
                  return (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium p-3 lg:p-4">
                        {ad.sequenceNumber}
                      </TableCell>
                      <TableCell className="p-3 lg:p-4">
                        <div className="flex items-center gap-2 lg:gap-3 max-w-xs">
                          {image && (
                            <div className="relative h-10 w-10 lg:h-12 lg:w-12 overflow-hidden rounded-md flex-shrink-0">
                              <Image
                                src={`/api/images?imageName=${image.fileName}`}
                                alt="Ad image"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="line-clamp-2 text-xs lg:text-sm">
                            {getAdContent(ad)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 lg:p-4">
                        <Badge variant={getStatusVariant(ad.status) as any} className="text-xs">
                          {ad.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-3 lg:p-4">
                        <div className="space-y-1 max-w-xs">
                          <div className="text-xs lg:text-sm font-medium">{ad.mainCategory?.name}</div>
                          {(ad.categoryOne?.name || ad.categoryTwo?.name || ad.categoryThree?.name) && (
                            <div className="text-xs text-muted-foreground">
                              {[ad.categoryOne?.name, ad.categoryTwo?.name, ad.categoryThree?.name]
                                .filter(Boolean)
                                .join(" → ")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-3 lg:p-4">
                        <div className="text-xs lg:text-sm">
                          <div>{ad.city || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">{ad.state || "N/A"}</div>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 lg:p-4">
                        <div className="text-xs lg:text-sm max-w-xs">
                          <div className="font-medium">{ad.customer?.user?.name || "Unknown"}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {ad.customer?.user?.email || ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 lg:p-4">
                        <div className="text-xs lg:text-sm">
                          {format(new Date(ad.created_at), "MMM dd, yyyy")}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(ad.created_at), "hh:mm a")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 lg:p-4">
                        <Link href={getViewLink(ad)}>
                          <Button variant="outline" size="sm" className="text-xs">
                            <EyeIcon className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4 p-4">
            {data.items.map((ad: any) => {
              const image = getAdImage(ad);

              return (
                <Card key={ad.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">#{ad.sequenceNumber}</span>
                      <Badge variant={getStatusVariant(ad.status) as any} className="text-xs">
                        {ad.status.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <div className="flex items-start gap-3">
                      {image && (
                        <div className="relative h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
                          <Image
                            src={`/api/images?imageName=${image.fileName}`}
                            alt="Ad image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-3">{getAdContent(ad)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium">{ad.mainCategory?.name}</p>
                      {(ad.categoryOne?.name || ad.categoryTwo?.name || ad.categoryThree?.name) && (
                        <p className="text-xs text-muted-foreground">
                          {[ad.categoryOne?.name, ad.categoryTwo?.name, ad.categoryThree?.name]
                            .filter(Boolean)
                            .join(" → ")}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-xs text-muted-foreground">
                          {ad.city || "N/A"}, {ad.state || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Customer</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {ad.customer?.user?.name || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(ad.created_at), "MMM dd, yyyy")}
                      </div>
                      <Link href={getViewLink(ad)}>
                        <Button variant="outline" size="sm" className="text-xs">
                          <EyeIcon className="mr-1 h-3 w-3" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
  
      {data.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 md:mt-6 gap-2 px-4 md:px-0">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage <= 1}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm w-full sm:w-auto"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>
  
          <div className="text-sm text-muted-foreground order-first sm:order-none">
            Page {currentPage} of {data.totalPages}
          </div>
  
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage >= data.totalPages}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm w-full sm:w-auto"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}