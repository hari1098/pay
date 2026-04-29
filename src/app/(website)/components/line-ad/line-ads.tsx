"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { LineAd } from "@/lib/types/lineAd";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CitySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import LineAdCard from "./line-ad-card";

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

const QuickSearchBar = ({
  cid = 0,
  sid = 0,
}: {
  cid?: number;
  sid?: number;
}) => {
  const params = useSearchParams();

  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [countryId] = useState(101); 
  const [stateId, setStateId] = useState<number>(sid);
  const [stateName, setStateName] = useState<string>("");
  const [cityId, setCityId] = useState<number>(cid);
  const [cityName, setCityName] = useState<string>("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories/tree");
      return data;
    },
  });

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (search) {
      params.append("search", search);
    }

    if (selectedCategories.length > 0) {
      selectedCategories.forEach((catId) => {
        params.append("categoryId", catId);
      });
    }

    if (stateName) {
      params.append("state", stateName);
    }

    if (cityName) {
      params.append("city", cityName);
    }

    router.push(`/search/results?${params.toString()}`);
  };

  const flattenCategories = (categories: any[] = []) => {
    let result: any[] = [];

    categories.forEach((category) => {
      result.push({
        id: category.id,
        name: category.name,
      });

      if (category.children && category.children.length > 0) {
        result = [...result, ...flattenCategories(category.children)];
      }
    });

    return result;
  };

  const flatCategories = flattenCategories(categories);

  return (
    <div className="bg-gray-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-auto flex-1">
            <StateSelect
              countryid={countryId}
              onChange={(e: any) => {
                setStateId(e.id);
                setStateName(e.name);
                setCityId(0);
                setCityName("");
              }}
              placeHolder="Select State"
              containerClassName="w-full"
              inputClassName="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div className="w-full sm:w-auto flex-1">
            <CitySelect
              countryid={countryId}

              stateid={stateId ?? 0}
              onChange={(e: any) => {
                setCityId(e.id);
                setCityName(e.name);
              }}
              placeHolder="Select City"
              containerClassName="w-full"
              inputClassName="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              disabled={!stateId}
            />
          </div>

          <div className="w-full sm:w-auto flex-1">
            <Select
              value={selectedCategories[0] || ""}
              onValueChange={(value) => setSelectedCategories([value])}
            >
              <SelectTrigger className="h-10 w-full bg-white border-gray-300">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {flatCategories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="bg-blue-500 hover:bg-blue-600 h-10 px-4"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" />
            Search Now
          </Button>
        </div>

        {(selectedCategories.length > 0 || stateName || cityName) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategories.map((catId) => {
              const category = flatCategories?.find((c) => c.id === catId);
              return category ? (
                <Badge
                  key={catId}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {category.name}
                </Badge>
              ) : null;
            })}

            {stateName && (
              <Badge className="bg-black text-white hover:bg-gray-800">
                {stateName}
              </Badge>
            )}

            {cityName && (
              <Badge className="bg-black text-white hover:bg-gray-800">
                {cityName}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function LineAds() {
  const [categoryId, setCategoryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [paramsReady, setParamsReady] = useState(false);
  const params = useSearchParams();
  useEffect(() => {
    const categoryId = params.get("categoryId");
    const stateId = params.get("stateId");
    const cityId = params.get("cityId");

    if (categoryId) setCategoryId(categoryId);
    if (stateId) setStateId(stateId);
    if (cityId) setCityId(cityId);
    setParamsReady(true);
  }, [params]);

  console.log("lineadsPage", params);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/current");
        setIsAuthenticated(!!data);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["linead", new Date().getDate(), categoryId, stateId, cityId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      if (stateId) params.append("stateId", stateId);
      if (cityId) params.append("cityId", cityId);

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

    if (!isAuthenticated) {
      return data.slice(0, ADS_PER_PAGE);
    }
    const startIdx = (currentPage - 1) * ADS_PER_PAGE;
    return data.slice(startIdx, startIdx + ADS_PER_PAGE);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (isError) {
    return <ErrorDisplay onRetry={() => refetch()} />;
  }

  return (
    <div className="flex-1">

      <div className="py-4">
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
                  <div className="aspect-video w-full">
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

            {isAuthenticated && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      aria-label={`Page ${page}`}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No advertisements available today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
