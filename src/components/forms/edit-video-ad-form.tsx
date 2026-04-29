"use client";

import api from "@/lib/api";
import type { VideoAd } from "@/lib/types/videoAd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle, CalendarIcon, ImageIcon, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { FieldPath, useForm } from "react-hook-form";
import { videoAdFormSchema, VideoAdFormValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-country-state-city/dist/react-country-state-city.css";
import Zoom from "react-medium-image-zoom";
import { useEffect, useState } from "react";
import { SubCategory } from "@/lib/types/category";
import { AdComment } from "@/lib/types/ad-comment";
import { AdStatus } from "@/lib/enum/ad-status";
import { AdType } from "@/lib/enum/ad-type";
import { User } from "@/lib/types/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PostedBy } from "@/lib/enum/posted-by";
import { toast } from "sonner";
import { Media } from "@/lib/types/media";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import React from "react";
import { Input } from "../ui/input";
import { CitySelect, StateSelect } from "react-country-state-city";
import { INDIA_ID } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { PageType } from "@/lib/enum/page-type";
import { PositionType } from "@/lib/enum/position-type";
import { AdPositionSelector } from "./ad-position-selector";

export function EditVideoAdForm({ adId }: { adId: string }) {
  const router = useRouter();
  const [mainCategoryId, setMainCategoryId] = useState("");
  const [level1Categories, setLevel1Categories] = useState<SubCategory[]>([]);
  const [level2Categories, setLevel2Categories] = useState<SubCategory[]>([]);
  const [level3Categories, setLevel3Categories] = useState<SubCategory[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [state, setState] = useState<any>(null);
  const [city, setCity] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<
    { id: string; url: string } | undefined
  >();

  const {
    data: ad,
    isLoading,
    error,
    refetch: refetchAd,
  } = useQuery({
    queryKey: ["ad", adId],
    queryFn: async () => {
      const response = await api.get<VideoAd>(`/video-ad/${adId}`);
      return response.data;
    },
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get<User>("auth/profile");
      return response.data;
    },
  });

  const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<Media>("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("Video uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload video", {
        description: "Please try again or use a different video.",
      });
    },
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<SubCategory[]>("/categories/tree");
      return response.data;
    },
  });

  const {
    data: holdComment,
    refetch,
    isLoading: loadingComment,
  } = useQuery({
    queryKey: ["holds", adId],
    queryFn: async () => {
      const response = await api.get<AdComment[]>(
        `ad-comments/ad/${AdType.VIDEO}/${adId}?actionType=${AdStatus.HOLD}`
      );
      if (response.data.length > 0) {
        return response.data[0];
      }
      return null;
    },
    enabled: ad && ad.status === AdStatus.HOLD,
  });

  const { mutate: updateAd, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: VideoAdFormValues) => {
      const response = await api.patch(`/video-ad/${adId}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Ad updated successfully", {
        description: "Your advertisement has been updated.",
      });
      router.push("/dashboard/my-ads/video-ads");
    },
    onError: () => {
      toast.error("Failed to update advertisement", {
        description: "Please check your form and try again.",
      });
    },
  });

  useEffect(() => {
    router.refresh();
  }, []);

  const { mutate: sendForReview, isPending: isSendingForReview } = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `ad-comments/send-for-review/${AdType.VIDEO}/${adId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Ad sent for review", {
        description: "Your advertisement has been sent for review.",
      });
      router.push("/dashboard/my-ads/video-ads");
    },
    onError: () => {
      toast.error("Failed to update advertisement", {
        description: "Please check your form and try again.",
      });
    },
  });

  const form = useForm<VideoAdFormValues>({
    resolver: zodResolver(videoAdFormSchema),
    defaultValues: {
      dates: [],
      mainCategoryId: "",
      categoryOneId: "",
      categoryTwoId: "",
      categoryThreeId: "",
      imageId: "",
      state: "",
      city: "",
      postedBy: PostedBy.OWNER,
      pageType: PageType.HOME,
      side: PositionType.LEFT_SIDE,
      position: 1,
    },
  });

  useEffect(() => {
    if (categories.length > 0 && ad && !isLoading && !isLoadingCategories) {
      const mc = categories.find((cat) => cat.id === ad.mainCategory.id);
      if (mc) {
        form.setValue("mainCategoryId", mc.id, { shouldValidate: false });
        setLevel1Categories(mc.subCategories ?? []);

        const categoryOne = mc.subCategories?.find(
          (category) => category.id === ad.categoryOne?.id
        );
        if (categoryOne) {
          form.setValue("categoryOneId", categoryOne.id, {
            shouldValidate: false,
          });
          setLevel2Categories(categoryOne.subCategories ?? []);

          const categoryTwo = categoryOne.subCategories?.find(
            (category) => category.id === ad.categoryTwo?.id
          );
          if (categoryTwo) {
            form.setValue("categoryTwoId", categoryTwo.id, {
              shouldValidate: false,
            });
            setLevel3Categories(categoryTwo.subCategories ?? []);

            const categoryThree = categoryTwo.subCategories?.find(
              (category) => category.id === ad.categoryThree?.id
            );
            if (categoryThree) {
              form.setValue("categoryThreeId", categoryThree.id, {
                shouldValidate: false,
              });
            }
          }
        }
      }
    }
  }, [categories, ad, isLoading, isLoadingCategories, form]);

  useEffect(() => {
    if (isLoading === false && ad !== undefined && profile !== undefined) {

      const formValues: Partial<VideoAdFormValues> = {
        imageId: ad.image.id,
        dates: ad.dates.map((d) => new Date(d)),
        postedBy: ad.postedBy,
        state: ad.state,
        sid: ad.sid,
        city: ad.city,
        cid: ad.cid,
        mainCategoryId: ad.mainCategory.id,
        categoryOneId: ad.categoryOne?.id || "",
        categoryTwoId: ad.categoryTwo?.id || "",
        categoryThreeId: ad.categoryThree?.id || "",
      };

      if (ad.position) {
        formValues.pageType = ad.position.pageType as PageType;
        formValues.side = ad.position.side as PositionType;
        if (ad.position.position) {
          formValues.position = ad.position.position;
        }
      }

      form.reset(formValues);

      setUploadedImage({
        id: ad.image.id,
        url: `/api/images?imageName=${ad.image.fileName}`,
      });

      setSelectedDates(ad.dates.map((d) => new Date(d)));
      setState({ id: ad.sid, name: ad.state });
      setCity({ id: ad.cid, name: ad.city });
    }
  }, [ad, profile, isLoading, form]);

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

  const mcId = form.watch("mainCategoryId");
  const c1Id = form.watch("categoryOneId");
  const c2Id = form.watch("categoryTwoId");

  useEffect(() => {
    if (mcId && categories.length > 0 && ad) {
      const mainCategory = categories.find((category) => category.id === mcId);
      setLevel1Categories(mainCategory?.subCategories || []);

      if (ad.mainCategory.id !== mcId) {
        form.setValue("categoryOneId", "", { shouldValidate: false });
        form.setValue("categoryTwoId", "", { shouldValidate: false });
        form.setValue("categoryThreeId", "", { shouldValidate: false });
        setLevel2Categories([]);
        setLevel3Categories([]);
      }
    }
  }, [mcId, categories, ad, form]);

  useEffect(() => {
    if (c1Id && level1Categories.length > 0 && ad) {
      const subCategory = level1Categories.find(
        (category) => category.id === c1Id
      );
      setLevel2Categories(subCategory?.subCategories || []);

      if (ad.categoryOne?.id !== c1Id) {
        form.setValue("categoryTwoId", "", { shouldValidate: false });
        form.setValue("categoryThreeId", "", { shouldValidate: false });
        setLevel3Categories([]);
      }
    }
  }, [c1Id, level1Categories, ad, form]);

  useEffect(() => {
    if (c2Id && level2Categories.length > 0 && ad) {
      const subCategory = level2Categories.find(
        (category) => category.id === c2Id
      );
      setLevel3Categories(subCategory?.subCategories || []);

      if (ad.categoryTwo?.id !== c2Id) {
        form.setValue("categoryThreeId", "", { shouldValidate: false });
      }
    }
  }, [c2Id, level2Categories, ad, form]);

  const removeImage = () => {
    setUploadedImage(undefined);
    form.setValue("imageId", "", {
      shouldValidate: true,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    uploadImage(
      { file },
      {
        onSuccess: (result) => {
          setUploadedImage({
            id: result.id,
            url: `/api/images?imageName=${result.fileName}`,
          });

          form.setValue("imageId", result.id, {
            shouldValidate: true,
          });
        },
      }
    );

    e.target.value = "";
  };

  const onSubmit = (data: VideoAdFormValues) => {

    if (
      ad &&
      data.mainCategoryId === ad.mainCategory.id &&
      data.categoryOneId === (ad.categoryOne?.id || "") &&
      data.categoryTwoId === (ad.categoryTwo?.id || "") &&
      data.categoryThreeId === (ad.categoryThree?.id || "") &&
      data.imageId === ad.image.id &&
      data.state === ad.state &&
      data.city === ad.city &&
      JSON.stringify(data.dates.map((d) => d.toISOString()).sort()) ===
        JSON.stringify(ad.dates.sort()) &&
      data.pageType === ad.position?.pageType &&
      data.side === ad.position?.side &&
      data.position === (ad.position?.position || undefined)
    ) {
      toast.info("No changes detected", {
        description: "You haven't made any changes to the advertisement.",
      });
      return;
    }

    updateAd(data);
  };

  if (isLoading || isLoadingCategories || isLoadingProfile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load advertisement data.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 py-2">
      <Form {...form}>
        <form className="space-y-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
            <FormField
              control={form.control}
              name="mainCategoryId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Main category" />
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

            <FormField
              control={form.control}
              name="categoryOneId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Subcategory" />
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

            <FormField
              control={form.control}
              name="categoryTwoId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Type" />
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

            <FormField
              control={form.control}
              name="categoryThreeId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Detail type" />
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="postedBy"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Posted by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PostedBy.OWNER}>Owner</SelectItem>
                        <SelectItem value={PostedBy.AGENCY}>Agency</SelectItem>
                        <SelectItem value={PostedBy.DEALER}>Dealer</SelectItem>
                        <SelectItem value={PostedBy.PROMOTERDEVELOPER}>
                          Developer
                        </SelectItem>
                        <SelectItem value={PostedBy.OTHERS}>Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="imageId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">Video</div>
                      <div className="text-xs text-gray-500 mb-1">
                        MP4, WebM, OGG, Max 50MB
                      </div>
                      <div className="relative aspect-video border border-dashed rounded overflow-hidden bg-gray-50">
                        {uploadedImage ? (
                          <>
                            <video
                              controls
                              src={uploadedImage.url || "/placeholder.svg"}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-5 w-5 bg-white text-gray-700 hover:bg-gray-200"
                              onClick={() => removeImage()}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                            {isUploading ? (
                              <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                            ) : (
                              <>
                                <ImageIcon className="h-3 w-3 text-gray-400 mb-0.5" />
                                <span className="text-xs text-gray-500">
                                  Upload
                                </span>
                              </>
                            )}
                            <input
                              type="file"
                              accept=".mp4,.webm,.ogg"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e)}
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

            <div className="space-y-1">
              <div className="text-xs text-gray-600">Location</div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="country-select-container">
                  <StateSelect
                    countryid={INDIA_ID}
                    onChange={setState}
                    placeHolder={ad?.state || "State"}
                    containerClassName="country-select-wrapper"
                    inputClassName="country-select-input text-xs h-8"
                  />
                </div>
                <div className="country-select-container">
                  <CitySelect
                    countryid={INDIA_ID}
                    stateid={state?.id || ad?.sid}
                    onChange={setCity}
                    placeHolder={ad?.city || "City"}
                    disabled={!state && !ad?.sid}
                    containerClassName="country-select-wrapper"
                    inputClassName="country-select-input text-xs h-8"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name={"pageType"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Page *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Page" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PageType.HOME}>Home</SelectItem>
                      <SelectItem value={PageType.CATEGORY}>
                        Category
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"side"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Side *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Side" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PositionType.LEFT_SIDE}>
                        Left
                      </SelectItem>
                      <SelectItem value={PositionType.RIGHT_SIDE}>
                        Right
                      </SelectItem>
                      <SelectItem value={PositionType.CENTER_TOP}>
                        Top
                      </SelectItem>
                      <SelectItem value={PositionType.CENTER_BOTTOM}>
                        Bottom
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"position"}
              render={({ field }) => {
                const positionType = form.watch("side") as PositionType;
                const shouldShowPositionNumber = ![
                  PositionType.CENTER_BOTTOM,
                  PositionType.CENTER_TOP,
                ].includes(positionType);

                if (!shouldShowPositionNumber) {
                  return <div className="hidden" />;
                }

                return (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Pos #</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="#" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-8 text-xs"
                        >
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {field.value.length > 0
                            ? `${field.value.length} date${
                                field.value.length > 1 ? "s" : ""
                              }`
                            : "Select dates"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="multiple"
                          selected={field.value.map((date) =>
                            typeof date === "string" ? new Date(date) : date
                          )}
                          max={93}
                          onSelect={(dates) => {
                            const selectedDates = dates || [];
                            field.onChange(selectedDates);
                          }}
                          fromDate={new Date()}
                          className="rounded border"
                        />
                      </PopoverContent>
                    </Popover>

                    {field.value.length > 0 && (
                      <div className="p-1.5 border rounded bg-gray-50 max-h-20 overflow-y-auto">
                        <div className="flex flex-wrap gap-1">
                          {field.value
                            .map((dateStr) => new Date(dateStr))
                            .sort((a, b) => a.getTime() - b.getTime())
                            .map((date, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs px-1.5 py-0"
                              >
                                {format(date, "MMM d")}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newDates = field.value.filter(
                                      (d) => d !== date
                                    );
                                    field.onChange(newDates);
                                  }}
                                  className="ml-0.5 text-gray-500 hover:text-gray-700"
                                >
                                  <X className="h-2 w-2" />
                                </button>
                              </Badge>
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

          {ad?.status === AdStatus.HOLD && !loadingComment && (
            <div className="bg-yellow-100 rounded px-2 py-1.5 border text-xs">
              <div className="flex items-center gap-1">
                <AlertCircle size={14} />
                <span className="font-semibold">On hold</span>
              </div>
              <p className="border border-gray-400 mt-1 p-1 rounded text-xs">
                {holdComment?.comment}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="px-3 h-8 text-xs"
            >
              Back
            </Button>

            <div className="flex gap-1.5">
              {ad?.status === AdStatus.HOLD && (
                <Button
                  type="button"
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-700 px-3 h-8 text-xs"
                  onClick={() => sendForReview()}
                  disabled={isSendingForReview}
                >
                  {isSendingForReview ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Review"
                  )}
                </Button>
              )}
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="px-3 h-8 text-xs"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
