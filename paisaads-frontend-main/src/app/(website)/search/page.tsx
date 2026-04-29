"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search, X } from "lucide-react";
import {
  StateSelect,
  CitySelect,
  CountrySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";

const searchFormSchema = z.object({
  categoryId: z.string(),
  stateId: z.number().optional(),
  cityId: z.number().optional(),
  countryId: z.number().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

export default function SearchPage() {
  const router = useRouter();
  const [countryId, setCountryId] = useState(101); 
  const [stateId, setStateId] = useState(0);
  const [cityId, setCityId] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const params = useSearchParams();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      categoryId: "",
      cityId: 0,
      stateId: 0,
      countryId: 101,
    },
  });

  useEffect(() => {
    const countryId = params.get("countryId");
    if (countryId) {
      setCountryId(parseInt(countryId));
    }
    const stateId = params.get("stateId");
    if (stateId) {
      setStateId(parseInt(stateId));
    }
    const cityId = params.get("cityId");
    if (cityId) {
      setCityId(parseInt(cityId));
    }
    const categoryId = params.get("categoryId");
    if (categoryId) {
      setCategoryId(categoryId);
      form.setValue("categoryId", categoryId);
    }
  }, [params, form]);

  const { data: categories } = useQuery({
    queryKey: ["categoryTree"],
    queryFn: async () => {
      const { data } = await api.get("/categories/tree");
      return data;
    },
  });

  const { data: sloganData } = useQuery({
    queryKey: ["searchSlogan"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/search-slogan");
      return data;
    },
  });

  const flattenCategories = (categories: any[] = []) => {
    let result: any[] = [];
    categories.forEach((category) => {
      result.push(category);
      if (category.children && category.children.length > 0) {
        result = [...result, ...flattenCategories(category.children)];
      }
    });
    return result;
  };

  const flatCategories = flattenCategories(categories);

  const onSubmit = (values: SearchFormValues) => {

    const params = new URLSearchParams();
    if (values.categoryId) {
      params.append("categoryId", values.categoryId);
    }
    if (values.stateId) {
      params.append("stateId", values.stateId.toString());
    }
    if (values.cityId) {
      params.append("cityId", values.cityId.toString());
    }
    params.append(
      "countryId",
      values.countryId?.toString() || countryId.toString()
    );
    window.scrollTo(0, 0);

    router.push(`/search/results?${params.toString()}`);
  };

  return (
    <div className="pt-20 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
          {sloganData?.primarySlogan || "Find What You Need"}
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-12">
          {sloganData?.secondarySlogan || "Search through thousands of classified advertisements"}
        </p>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 max-w-5xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={categoryId ?? field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 w-full rounded text-sm">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {flatCategories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CountrySelect
                          id="101"

                          onChange={(countryObj: any) => {
                            field.onChange(countryObj.id);
                            setCountryId(countryObj.id);
                            form.resetField("countryId");
                          }}
                          placeHolder="Select country"
                          containerClassName="w-full"
                          inputClassName="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={field.value || undefined}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <StateSelect
                          countryid={countryId}
                          onChange={(stateObj: any) => {
                            field.onChange(stateObj.id);
                            form.resetField("cityId");
                          }}
                          placeHolder="Select state"
                          containerClassName="w-full"
                          inputClassName="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={field.value || undefined}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CitySelect
                          countryid={countryId}
                          stateid={form.getValues("stateId") || 0}
                          onChange={(cityObj: any) => {
                            field.onChange(cityObj.id);
                          }}
                          placeHolder="Select city"
                          containerClassName="w-full"
                          inputClassName="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={field.value || cityId}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="h-10 px-6">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
                {params.size > 0 && (
                  <Button
                    onClick={() => {

                      const params = new URLSearchParams();
                      window.history.pushState({}, "", `/search`);
                      form.reset();

                      window.location.reload();
                    }}
                    className="h-10 px-6"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
