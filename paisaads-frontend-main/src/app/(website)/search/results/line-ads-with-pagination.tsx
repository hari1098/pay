"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { LineAd } from "@/lib/types/lineAd";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LineAdCard from "../../components/line-ad/line-ad-card";

const ImageGallery = ({
  images,
  apiUrl,
}: {
  images: any[];
  apiUrl: string | undefined;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="relative group">
        <div
          className="w-full overflow-hidden cursor-pointer"
          onClick={() => setShowLightbox(true)}
        >
          <img
            src={`/api/images/?imageName=${images[currentIndex].fileName}`}
            alt="Advertisement"
            className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {currentIndex + 1}/{images.length}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 p-2 bg-gradient-to-t from-black/50 to-transparent">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  currentIndex === idx
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showLightbox} onOpenChange={setShowLightbox}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
              onClick={() => setShowLightbox(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-center justify-center h-full">
              <img
                src={`/api/images?imageName=${images[currentIndex].fileName}`}
                alt="Advertisement"
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      currentIndex === idx
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/80"
                    )}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ErrorDisplay = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
    <h3 className="text-lg font-semibold mb-2">
      Failed to load advertisements
    </h3>
    <p className="text-muted-foreground mb-4">
      There was an error loading the advertisements. Please try again.
    </p>
    <Button onClick={onRetry}>Retry</Button>
  </div>
);

export default function LineAdsWithPagination() {
  const [categoryId, setCategoryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [paramsReady, setParamsReady] = useState(false);
  const params = useSearchParams();

  useEffect(() => {
    const categoryId = params.get("categoryId");
    const stateId = params.get("stateId");
    const cityId = params.get("cityId");
    const countryId = params.get("countryId");

    if (categoryId) setCategoryId(categoryId);
    if (stateId) setStateId(stateId);
    if (cityId) setCityId(cityId);
    if (countryId) setCountryId(countryId);
    setParamsReady(true);
  }, [params]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["search-linead", categoryId, stateId, cityId, countryId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      if (stateId) params.append("stateId", stateId);
      if (cityId) params.append("cityId", cityId);
      if (countryId) params.append("countryId", countryId);

      const { data } = await api.get(`/line-ad/today?${params.toString()}`);
      return data.sort((a: LineAd, b: LineAd) => {
        const dateA = new Date(a.updated_at || a.created_at).getTime();
        const dateB = new Date(b.updated_at || b.created_at).getTime();
        return dateB - dateA;
      });
    },
    enabled: paramsReady,
  });

  const ADS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = data ? Math.ceil(data.length / ADS_PER_PAGE) : 1;

  const getPaginatedItems = () => {
    if (!data) return [];
    const startIdx = (currentPage - 1) * ADS_PER_PAGE;
    return data.slice(startIdx, startIdx + ADS_PER_PAGE);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, stateId, cityId, countryId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const getPaginationNumbers = () => {
    const delta = 2; 
    const numbers = [];
    const maxPages = Math.min(totalPages, 7); 

    if (totalPages <= 7) {

      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {

      numbers.push(1);

      if (currentPage > delta + 2) {
        numbers.push("...");
      }

      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      for (let i = start; i <= end; i++) {
        numbers.push(i);
      }

      if (currentPage < totalPages - delta - 1) {
        numbers.push("...");
      }

      if (totalPages > 1) {
        numbers.push(totalPages);
      }
    }

    return numbers;
  };

  if (isError) {
    return <ErrorDisplay onRetry={() => refetch()} />;
  }

  return (
    <div className="flex-1">
      <div className="py-4">
        {data && (
          <div className="mb-4 text-sm text-gray-600">
            {data.length > 0 ? (
              <p>
                Showing {getPaginatedItems().length} of {data.length} results
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </p>
            ) : (
              <p>No results found</p>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-0">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Card
                  key={i}
                  className="h-full flex flex-col overflow-hidden break-inside-avoid mb-4"
                >
                  <div className="p-4 flex-grow">
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-32 mt-4 mb-1" />
                    <Skeleton className="h-3 w-40 mb-1" />
                    <Skeleton className="h-3 w-24 mb-3" />
                  </div>
                  <div className="h-48 w-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                </Card>
              ))}
          </div>
        ) : data && data.length > 0 ? (
          <>
            <div className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-8 transition-all ease-in">
              {getPaginatedItems().map((ad: any, index: number) => (
                <LineAdCard key={ad.id} ad={ad} index={index} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {getPaginationNumbers().map((pageNum, index) => (
                    <div key={index}>
                      {pageNum === "..." ? (
                        <span className="px-2 py-1 text-gray-500">...</span>
                      ) : (
                        <Button
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum as number)}
                          className="min-w-[32px]"
                        >
                          {pageNum}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No advertisements found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search filters or check back later for new listings.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}