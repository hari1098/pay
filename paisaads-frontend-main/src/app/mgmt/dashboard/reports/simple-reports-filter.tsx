"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FilterIcon, XIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AdStatus } from "@/lib/enum/ad-status";
import { AdType } from "@/lib/enum/ad-type";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ReportsFilters } from "./page";
import { PostedBy } from "@/lib/enum/posted-by";
interface SimpleReportsFilterProps {
  filters: ReportsFilters;
  onFiltersChange: (filters: ReportsFilters) => void;
}

export function SimpleReportsFilter({
  filters,
  onFiltersChange,
}: SimpleReportsFilterProps) {

  const { data: locations } = useQuery({
    queryKey: ["filter-locations"],
    queryFn: async () => {
      const { data } = await api.get("/reports/locations");
      return data;
    },
  });

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["filter-categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories/tree");
      console.log("Categories data:", data); 
      return data;
    },
  });

  if (categoriesError) {
    console.error("Error loading categories:", categoriesError);
  }

  const handleFilterChange = (key: keyof ReportsFilters, value: any) => {
    const newFilters: ReportsFilters = { ...filters, [key]: value };

    if (key === "mainCategory") {
      newFilters.categoryOne = "";
      newFilters.categoryTwo = "";
      newFilters.categoryThree = "";
    } else if (key === "categoryOne") {
      newFilters.categoryTwo = "";
      newFilters.categoryThree = "";
    } else if (key === "categoryTwo") {
      newFilters.categoryThree = "";
    }

    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      adType: "",
      status: "",
      startDate: null,
      endDate: null,
      state: "",
      city: "",
      userType: "",
      mainCategory: "",
      categoryOne: "",
      categoryTwo: "",
      categoryThree: "",
    });
  };

  const activeFiltersCount = Object.values(filters).filter((value) => {
    if (value === null || value === "" || value === undefined) return false;
    return true;
  }).length;

  return (
    <Card className="p-4 md:p-6">
      <CardHeader className="p-0 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-semibold">
            <FilterIcon className="h-4 w-4 md:h-5 md:w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="flex items-center gap-2 w-fit"
            >
              <XIcon className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-4 md:gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="adType">Ad Type</Label>
              <Select
                value={filters.adType}
                onValueChange={(value) => handleFilterChange("adType", value)}
              >
                <SelectTrigger className="p-2">
                  <SelectValue placeholder="Select ad type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AdType.LINE}>Line Ads</SelectItem>
                  <SelectItem value={AdType.POSTER}>Poster Ads</SelectItem>
                  <SelectItem value={AdType.VIDEO}>Video Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="p-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AdStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={AdStatus.FOR_REVIEW}>
                    For Review
                  </SelectItem>
                  <SelectItem value={AdStatus.REJECTED}>Rejected</SelectItem>
                  <SelectItem value={AdStatus.HOLD}>Hold</SelectItem>
                  <SelectItem value={AdStatus.YET_TO_BE_PUBLISHED}>
                    Yet To Be Published
                  </SelectItem>
                  <SelectItem value={AdStatus.PUBLISHED}>Published</SelectItem>
                  <SelectItem value={AdStatus.PAUSED}>Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={filters.state}
                onValueChange={(value) => handleFilterChange("state", value)}
              >
                <SelectTrigger className="p-2">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.states?.map((state: any) => (
                    <SelectItem key={state.name} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select
                value={filters.city}
                onValueChange={(value) => handleFilterChange("city", value)}
              >
                <SelectTrigger className="p-2">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.cities
                    ?.filter(
                      (city: any) =>
                        !filters.state || city.state === filters.state
                    )
                    ?.map((city: any) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select
                value={filters.userType}
                onValueChange={(value) => handleFilterChange("userType", value)}
              >
                <SelectTrigger className="p-2">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PostedBy.OWNER}>
                    {PostedBy.OWNER}
                  </SelectItem>
                  <SelectItem value={PostedBy.PROMOTERDEVELOPER}>
                    {PostedBy.PROMOTERDEVELOPER}
                  </SelectItem>
                  <SelectItem value={PostedBy.AGENCY}>
                    {PostedBy.AGENCY}
                  </SelectItem>
                  <SelectItem value={PostedBy.DEALER}>
                    {PostedBy.DEALER}
                  </SelectItem>
                  <SelectItem value={PostedBy.OTHERS}>
                    {PostedBy.OTHERS}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainCategory">Main Category</Label>
              <Select
                value={filters.mainCategory}
                onValueChange={(value) =>
                  handleFilterChange("mainCategory", value)
                }
              >
                <SelectTrigger className="p-2">
                  <SelectValue placeholder="Select main category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryOne">Category 1</Label>
              <Select
                value={filters.categoryOne}
                onValueChange={(value) =>
                  handleFilterChange("categoryOne", value)
                }
                disabled={!filters.mainCategory}
              >
                <SelectTrigger className="p-2">
                  <SelectValue placeholder="Select category one" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    ?.find((cat: any) => cat.id === filters.mainCategory)
                    ?.subCategories?.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryTwo">Category 2</Label>
              <Select
                value={filters.categoryTwo}
                onValueChange={(value) =>
                  handleFilterChange("categoryTwo", value)
                }
                disabled={!filters.categoryOne}
              >
                <SelectTrigger className="p-2">
                  <SelectValue placeholder="Select category two" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    ?.find((cat: any) => cat.id === filters.mainCategory)
                    ?.subCategories?.find(
                      (cat: any) => cat.id === filters.categoryOne
                    )
                    ?.subCategories?.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryThree">Category 3</Label>
              <Select
                value={filters.categoryThree}
                onValueChange={(value) =>
                  handleFilterChange("categoryThree", value)
                }
                disabled={!filters.categoryTwo}
              >
                <SelectTrigger className="p-2">
                  <SelectValue placeholder="Select category three" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    ?.find((cat: any) => cat.id === filters.mainCategory)
                    ?.subCategories?.find(
                      (cat: any) => cat.id === filters.categoryOne
                    )
                    ?.subCategories?.find(
                      (cat: any) => cat.id === filters.categoryTwo
                    )
                    ?.subCategories?.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal p-2",
                      !filters.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate
                      ? format(filters.startDate, "PPP")
                      : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.startDate || undefined}
                    onSelect={(date) =>
                      handleFilterChange("startDate", date || null)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal p-2",
                      !filters.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate
                      ? format(filters.endDate, "PPP")
                      : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.endDate || undefined}
                    onSelect={(date) =>
                      handleFilterChange("endDate", date || null)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
