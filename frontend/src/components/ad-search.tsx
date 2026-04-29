"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { StateSelect, CitySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import api from "@/lib/api";

export function SearchFilterSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [countryId, setCountryId] = useState(101); 
  const [stateId, setStateId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [stateName, setStateName] = useState<string>("");
  const [cityName, setCityName] = useState<string>("");

  const { data: categories, isLoading: categoriesLoading } = useQuery({
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

    router.push(`/search?${params.toString()}`);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleStateSelect = (stateObj: any) => {
    setStateId(stateObj.id);
    setStateName(stateObj.name);
    setCityId(null);
    setCityName("");
  };

  const handleCitySelect = (cityObj: any) => {
    setCityId(cityObj.id);
    setCityName(cityObj.name);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setStateId(null);
    setCityId(null);
    setStateName("");
    setCityName("");
  };

  return (
    <Card className="mb-6">
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Search advertisements..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categories</Label>
            {categoriesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-2">
                {categories.map((category: any) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No categories available
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Label>Location</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">State</Label>
                <StateSelect
                  countryid={countryId}
                  onChange={handleStateSelect}
                  placeHolder="Select State"
                  containerClassName="w-full"
                  inputClassName="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">City</Label>
                <CitySelect
                  countryid={countryId}

                  stateid={stateId ?? 0}
                  onChange={handleCitySelect}
                  placeHolder="Select City"
                  containerClassName="w-full"
                  inputClassName="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!stateId}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button className="flex-1" onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search Advertisements
          </Button>
          <Button
            variant="outline"
            onClick={resetFilters}
            className="sm:w-auto"
          >
            Clear All
          </Button>
        </div>
      </div>
    </Card>
  );
}
