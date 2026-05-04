"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, X, MapPin, Filter } from "lucide-react";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
  GetCity,
  GetState,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import api from "@/lib/api";

interface QuickSearchBarProps {
  className?: string;
}

export default function QuickSearchBar({
  className = "",
}: QuickSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentStateId = searchParams.get("stateId") || "";
  const currentCityId = searchParams.get("cityId") || "";

  useEffect(() => {

    const urlCategoryId = searchParams.get("categoryId") || "";
    const urlStateId = searchParams.get("stateId");
    const urlCityId = searchParams.get("cityId");
    const urlCountryId = searchParams.get("countryId");
    
    setCategoryId(urlCategoryId);
    setStateId(urlStateId ? parseInt(urlStateId) : 0);
    setCityId(urlCityId ? parseInt(urlCityId) : 0);

    if (urlCountryId) {
      setCountryId(parseInt(urlCountryId));

    } else {
      setCountryId(101);
      setCountryName("India");
    }

    if (!urlStateId) {
      setStateName("");
    }
    if (!urlCityId) {
      setCityName("");
    }
  }, [searchParams]);

  const [countryId, setCountryId] = useState<number>(101); 
  const [countryName, setCountryName] = useState<string>("India");
  const [stateId, setStateId] = useState<number>(+currentStateId);
  const [stateName, setStateName] = useState<string>("");
  const [cityId, setCityId] = useState<number>(+currentCityId);
  const [cityName, setCityName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>(currentCategoryId);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories/tree");
      return data;
    },
  });

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

  const handleQuickSearch = () => {
    const params = new URLSearchParams();

    if (categoryId) {
      params.append("categoryId", categoryId);
    }

    if (countryId) {
      params.append("countryId", countryId.toString());
    }

    if (stateId && stateId > 0) {
      params.append("stateId", stateId.toString());
    }

    if (cityId && cityId > 0) {
      params.append("cityId", cityId.toString());
    }

    router.push(`/search/results?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setCountryId(101);
    setCountryName("India");
    setStateId(0);
    setStateName("");
    setCityId(0);
    setCityName("");
    setCategoryId("");
  };

  return (
    <div className={`bg-white border-b shadow-sm ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 items-end">
          <div className="relative">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Country
            </label>
            <CountrySelect
              key={`country-${countryId}`}
              onChange={(e: any) => {
                setCountryId(e.id);
                setCountryName(e.name);
                setStateId(0);
                setStateName("");
                setCityId(0);
                setCityName("");
              }}
              placeHolder="Select country"
              containerClassName="w-full"
              inputClassName="w-full h-9 text-sm rounded-md border border-gray-300 px-3 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              State
            </label>
            <StateSelect
              key={`state-${countryId}-${stateId}`}
              countryid={countryId}
              onChange={(e: any) => {
                setStateId(e.id);
                setStateName(e.name);
                setCityId(0);
                setCityName("");
              }}

              placeHolder="Select state"
              containerClassName="w-full"
              inputClassName="w-full h-9 text-sm rounded-md border border-gray-300 px-3 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              City
            </label>
            <CitySelect
              key={`city-${countryId}-${stateId}-${cityId}`}
              countryid={countryId}
              stateid={stateId || 0}

              onChange={(e: any) => {
                setCityId(e.id);
                setCityName(e.name);
              }}
              placeHolder="Select city"
              containerClassName="w-full"
              inputClassName="w-full h-9 text-sm rounded-md border border-gray-300 px-3 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!stateId}
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-9 text-sm rounded-md border border-gray-300 px-3 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {flatCategories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleQuickSearch}
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md flex items-center gap-2 transition-colors"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>

            {(stateName || cityName || categoryId) && (
              <button
                onClick={clearAllFilters}
                className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-md flex items-center gap-1 transition-colors"
                title="Clear all filters"
              >
                <X size={16} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {(countryName !== "India" || stateName || cityName || categoryId) && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-600 mr-2">
              <Filter className="h-3 w-3 mr-1" />
              Active filters:
            </div>

            {countryName && countryName !== "India" && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                {countryName}
                <button
                  onClick={() => {
                    setCountryId(101);
                    setCountryName("India");
                    setStateId(0);
                    setStateName("");
                    setCityId(0);
                    setCityName("");
                  }}
                  className="hover:text-gray-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {stateName && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <MapPin size={10} /> {stateName}
                <button
                  onClick={() => {
                    setStateId(0);
                    setStateName("");
                    setCityId(0);
                    setCityName("");
                  }}
                  className="hover:text-gray-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {cityName && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                {cityName}
                <button
                  onClick={() => {
                    setCityId(0);
                    setCityName("");
                  }}
                  className="hover:text-gray-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {categoryId && flatCategories?.find((c) => c.id === categoryId) && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                {flatCategories.find((c) => c.id === categoryId)?.name}
                <button
                  onClick={() => setCategoryId("")}
                  className="hover:text-gray-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
