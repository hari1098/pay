"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { AdType } from "@/lib/enum/ad-type";
import { PageType } from "@/lib/enum/page-type";
import { PositionType } from "@/lib/enum/position-type";
import { PostedBy } from "@/lib/enum/posted-by";
import { MainCategory, SubCategory } from "@/lib/types/category";
import { Media } from "@/lib/types/media";
import { videoAdFormSchema, VideoAdFormValues } from "@/lib/validations";
import { AdPositionSelector } from "./ad-position-selector";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2, VideoIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CitySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

const INDIA_ID = 101;

export function PostVideoAdForm() {
  const [isAccepted, setIsAccepted] = useState(false);
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<{
    id: string;
    fileName: string;
  } | null>(null);

  const [level1Categories, setLevel1Categories] = useState<SubCategory[]>([]);
  const [level2Categories, setLevel2Categories] = useState<SubCategory[]>([]);
  const [level3Categories, setLevel3Categories] = useState<SubCategory[]>([]);

  const [state, setState] = useState<any>(null);
  const [city, setCity] = useState<any>(null);

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<MainCategory[]>("/categories/tree");
      return response.data;
    },
  });

  const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post<Media>("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Image uploaded successfully");
      setUploadedImage({ id: data.id, fileName: data.fileName });
      form.setValue("imageId", data.id, { shouldValidate: true });
    },
    onError: () => {
      toast.error("Failed to upload image", {
        description: "Please try again or use a different image.",
      });
    },
  });

  const { mutate: submitAd, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: VideoAdFormValues) => {
      const response = await api.post("/video-ad", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Video Ad created successfully", {
        description:
          "Your advertisement has been created and is pending review.",
      });
      router.push("/dashboard/my-ads/video-ads");
    },
    onError: () => {
      toast.error("Failed to create advertisement", {
        description: "Please check your form and try again.",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(videoAdFormSchema),
    defaultValues: {
      mainCategoryId: "",
      categoryOneId: "",
      categoryTwoId: "",
      categoryThreeId: "",
      imageId: "",
      state: "",
      sid: undefined,
      city: "",
      cid: undefined,
      postedBy: "",
      dates: [],
      pageType: PageType.HOME,
      side: PositionType.LEFT_SIDE,
      position: 1,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    uploadImage({ file });
    e.target.value = "";
  };

  const removeImage = () => {
    setUploadedImage(null);
    form.setValue("imageId", "", { shouldValidate: true });
  };

  useEffect(() => {
    const mainCategoryId = form.watch("mainCategoryId");
    if (mainCategoryId && categories.length > 0) {
      const mainCategory = categories.find((cat) => cat.id === mainCategoryId);
      setLevel1Categories(mainCategory?.subCategories || []);

      form.setValue("categoryOneId", "");
      form.setValue("categoryTwoId", "");
      form.setValue("categoryThreeId", "");
      setLevel2Categories([]);
      setLevel3Categories([]);
    }
  }, [form.watch("mainCategoryId"), categories, form]);

  useEffect(() => {
    const categoryOneId = form.watch("categoryOneId");
    if (categoryOneId && level1Categories.length > 0) {
      const categoryOne = level1Categories.find(
        (cat) => cat.id === categoryOneId
      );
      setLevel2Categories(categoryOne?.subCategories || []);

      form.setValue("categoryTwoId", "");
      form.setValue("categoryThreeId", "");
      setLevel3Categories([]);
    }
  }, [form.watch("categoryOneId"), level1Categories, form]);

  useEffect(() => {
    const categoryTwoId = form.watch("categoryTwoId");
    if (categoryTwoId && level2Categories.length > 0) {
      const categoryTwo = level2Categories.find(
        (cat) => cat.id === categoryTwoId
      );
      setLevel3Categories(categoryTwo?.subCategories || []);

      form.setValue("categoryThreeId", "");
    }
  }, [form.watch("categoryTwoId"), level2Categories, form]);

  useEffect(() => {
    if (state) {
      form.setValue("state", state.name);
      form.setValue("sid", state.id || state.iso2);
      form.setValue("city", "");
      form.setValue("cid", 0);
      setCity(null);
    }
  }, [state, form]);

  useEffect(() => {
    if (city) {
      form.setValue("city", city.name);
      form.setValue("cid", city.id || city.name);
    }
  }, [city, form]);
  console.log(form.formState.errors);

  const onSubmit = (data: VideoAdFormValues) => {
    if (!data.categoryOneId && level1Categories.length > 0) {
      toast.error("Please select a subcategory");
      return;
    }

    if (!data.categoryTwoId && level2Categories.length > 0) {
      toast.error("Please select a subcategory");
      return;
    }

    if (!data.categoryThreeId && level3Categories.length > 0) {
      toast.error("Please select a subcategory");
      return;
    }
    submitAd(data);
  };
  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="p-6">
        <h1 className="text-2xl font-medium mb-1">
          Create a new Video Advertisement
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-8">
              <div className="flex items-center gap-10">
                <FormField
                  control={form.control}
                  name="mainCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingCategories}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border border-gray-300 h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <SelectValue placeholder="Choose the type of item or service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
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

                {level1Categories.length > 0 && (
                  <FormField
                    control={form.control}
                    name="categoryOneId"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          required={level1Categories.length > 0}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border border-gray-300 h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {level1Categories.map((category) => (
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
                )}

                {level2Categories.length > 0 && (
                  <FormField
                    control={form.control}
                    name="categoryTwoId"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border border-gray-300 h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue placeholder="Select specific category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {level2Categories.map((category) => (
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
                )}

                {level3Categories.length > 0 && (
                  <FormField
                    control={form.control}
                    name="categoryThreeId"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border border-gray-300 h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue placeholder="Select final category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {level3Categories.map((category) => (
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
                )}
              </div>
            </div>


            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="mb-8">
                <FormField
                  control={form.control}
                  name="imageId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className=" gap-4">
                          <div className="relative h-96 border border-gray-300 border-dashed rounded-md overflow-hidden bg-gray-50">
                            {uploadedImage ? (
                              <>
                                <video
                                  src={`/api/images?imageName=${uploadedImage.fileName}`}
                                  className="w-full h-full object-cover"
                                  controls
                                  muted
                                  autoPlay
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6"
                                  onClick={removeImage}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                                {isUploading ? (
                                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                ) : (
                                  <>
                                    <VideoIcon className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">
                                      Upload Video
                                    </span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept=".mp4,.webm,.ogg"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                  disabled={isUploading}
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2 space-y-3">
                <div>
                  <AdPositionSelector
                    control={form.control}
                    adType={AdType.VIDEO}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <div className="mb-4">
                    <div className="country-select-container">
                      <StateSelect
                        countryid={INDIA_ID}
                        onChange={setState}
                        placeHolder="Select State"
                        containerClassName="country-select-wrapper"
                        inputClassName="country-select-input"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="country-select-container">
                      <CitySelect
                        countryid={INDIA_ID}
                        stateid={state?.id}
                        onChange={setCity}
                        placeHolder="Select City"
                        disabled={!state}
                        containerClassName="country-select-wrapper"
                        inputClassName="country-select-input"
                      />
                    </div>
                  </div>

                  <div className="hidden">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sid"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cid"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="postedBy"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormControl>
                            <Select
                              required
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="bg-white border w-full border-gray-300 h-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <SelectValue placeholder="Select who is posting" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={PostedBy.OWNER}>
                                  {PostedBy.OWNER}
                                </SelectItem>
                                <SelectItem value={PostedBy.AGENCY}>
                                  {PostedBy.AGENCY}
                                </SelectItem>
                                <SelectItem value={PostedBy.DEALER}>
                                  {PostedBy.DEALER}
                                </SelectItem>
                                <SelectItem value={PostedBy.PROMOTERDEVELOPER}>
                                  {PostedBy.PROMOTERDEVELOPER}
                                </SelectItem>
                                <SelectItem value={PostedBy.OTHERS}>
                                  {PostedBy.OTHERS}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="dates"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormControl>
                          <div className="space-y-4">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start "
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value.length > 0
                                    ? `${field.value.length} date${
                                        field.value.length > 1 ? "s" : ""
                                      } selected`
                                    : "Select dates"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="multiple"
                                  selected={field.value.map((date) =>
                                    typeof date === "string"
                                      ? new Date(date)
                                      : date
                                  )}
                                  onSelect={(dates) => {

                                    const selectedDates = dates || [];
                                    field.onChange(selectedDates);
                                  }}
                                  fromDate={new Date()}
                                  className="rounded-md border"
                                />
                              </PopoverContent>
                            </Popover>

                            {field.value.length > 0 && (
                              <div className="p-4 border rounded-md bg-gray-50">
                                <h4 className="text-sm font-medium mb-2">
                                  Selected Dates ({field.value.length}):
                                </h4>
                                <div className="space-y-3">
                                  {Object.entries(

                                    field.value.reduce((acc, dateStr) => {
                                      const date = new Date(dateStr);
                                      const monthYear = format(
                                        date,
                                        "MMMM yyyy"
                                      );
                                      if (!acc[monthYear]) {
                                        acc[monthYear] = [];
                                      }
                                      // @ts-ignore
                                      acc[monthYear].push({ date, dateStr });
                                      return acc;
                                    }, {} as Record<string, { date: Date; dateStr: string }[]>)
                                  )

                                    .sort(([monthYearA], [monthYearB]) => {
                                      const dateA = new Date(monthYearA);
                                      const dateB = new Date(monthYearB);
                                      return dateA.getTime() - dateB.getTime();
                                    })
                                    .map(([monthYear, dates]) => (
                                      <div
                                        key={monthYear}
                                        className="border-b pb-2 last:border-b-0 last:pb-0"
                                      >
                                        <h5 className="text-xs font-medium text-gray-700 mb-2">
                                          {monthYear}
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                          {dates
                                            .sort(
                                              (a, b) =>
                                                a.date.getTime() -
                                                b.date.getTime()
                                            )
                                            .map(({ date, dateStr }, index) => (
                                              <Badge
                                                key={dateStr}
                                                variant="secondary"
                                                className="px-3 py-1"
                                              >
                                                {format(date, "EEE, d")}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const newDates =
                                                      field.value.filter(
                                                        // @ts-ignore
                                                        (d) => d !== dateStr
                                                      );
                                                    field.onChange(newDates);
                                                  }}
                                                  className="ml-2 text-gray-500 hover:text-gray-700"
                                                >
                                                  <X className="h-3 w-3" />
                                                </button>
                                              </Badge>
                                            ))}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8"></div>
            <div className="flex items-center gap-3">
              <Input
                onClick={(e) => {
                  // @ts-ignore
                  setIsAccepted(e.target.checked);
                }}
                className="size-4"
                type="checkbox"
              />
              <p>
                I agree to the{" "}
                <Link
                  href="/terms-and-conditions"
                  className="text-blue-500 hover:underline"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-blue-500 hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
            <div className="pt-6">
              <Button
                type="submit"
                disabled={!isAccepted || isSubmitting}
                className="cursor-pointer w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium h-12 rounded-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Post Advertisement"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
