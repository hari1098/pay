import api from "@/lib/api";
import type { LineAd } from "@/lib/types/lineAd";
import type { PosterAd } from "@/lib/types/posterAd";
import type { VideoAd } from "@/lib/types/videoAd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle, CalendarIcon, ImageIcon, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { useForm } from "react-hook-form";
import { adFormSchema, AdFormValues } from "./ad-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { lineAdFormSchema, LineAdFormValues } from "@/lib/validations";
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
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
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
import { ColorPicker } from "@/components/ui/color-picker";

type AdData = LineAd | PosterAd | VideoAd;

interface EditAdFormProps {
  adId: string;
}

export default function EditLineAdForm({ adId }: EditAdFormProps) {
  const router = useRouter();
  const [mainCategoryId, setMainCategoryId] = useState("");
  const [level1Categories, setLevel1Categories] = useState<SubCategory[]>([]);
  const [level2Categories, setLevel2Categories] = useState<SubCategory[]>([]);
  const [level3Categories, setLevel3Categories] = useState<SubCategory[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [state, setState] = useState<any>(null);
  const [city, setCity] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ id: string; url: string } | undefined>
  >([]);

  const {
    data: ad,
    isLoading,
    error,
    refetch: refetchAd,
  } = useQuery({
    queryKey: ["ad", adId],
    queryFn: async () => {
      console.log("Fetching line ad with ID:", adId);
      try {
        const response = await api.get<LineAd>(`/line-ad/${adId}`);
        console.log("Line ad data received:", response.data);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch line ad:", error);
        throw error;
      }
    },
    enabled: !!adId,
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get<User>("auth/profile");
      return response.data;
    },
  });

  const {
    mutate: uploadImage,
    isPending: isUploading,
    variables: uploadingVariables,
  } = useMutation({
    mutationFn: async ({ file, index }: { file: File; index: number }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<Media>("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        data: response.data,
        index,
      };
    },
    onSuccess: () => {
      toast.success("Image uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload image", {
        description: "Please try again or use a different image.",
      });
    },
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      console.log("Fetching categories");
      try {
        const response = await api.get<SubCategory[]>("/categories/tree");
        console.log("Categories received:", response.data);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        throw error;
      }
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
        `ad-comments/ad/${AdType.LINE}/${adId}?actionType=${AdStatus.HOLD}`
      );
      if (response.data.length > 0) {
        return response.data[0];
      }
      return null;
    },
    enabled: ad && ad.status === AdStatus.HOLD,
  });

  const { mutate: updateAd, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: LineAdFormValues) => {
      const response = await api.patch(`/line-ad/${adId}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Ad updated successfully", {
        description: "Your advertisement has been updated.",
      });
      router.push("/dashboard/my-ads/line-ads");

    },
    onError: () => {
      toast.error("Failed to update advertisement", {
        description: "Please check your form and try again.",
      });
    },
  });

  const { mutate: sendForReview, isPending: isSendingForReview } = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `ad-comments/send-for-review/${AdType.LINE}/${adId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Ad sent for review", {
        description: "Your advertisement has been sent for review.",
      });

      router.push("/dashboard/my-ads/line-ads");
    },
    onError: () => {
      toast.error("Failed to update advertisement", {
        description: "Please check your form and try again.",
      });
    },
  });
  const form = useForm<LineAdFormValues>({
    resolver: zodResolver(lineAdFormSchema),
    defaultValues: {
      dates: [],
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
  });

  const removeImage = (index: number) => {
    const newUploadedImages = [...uploadedImages];
    newUploadedImages[index] = undefined;
    setUploadedImages(newUploadedImages);

    const currentImageIds = form.getValues("imageIds");
    const newImageIds = [...currentImageIds];

    newImageIds[index] = "" as any;
    form.setValue("imageIds", newImageIds.filter(Boolean), {
      shouldValidate: true,
    });
  };
  console.log(form.formState.errors);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    uploadImage(
      { file, index },
      {
        onSuccess: (result) => {
          const newUploadedImages = [...uploadedImages];
          newUploadedImages[index] = {
            id: result.data.id,
            url: result.data.fileName,
          };
          setUploadedImages(newUploadedImages);

          const currentImageIds = form.getValues("imageIds");
          const newImageIds = [...currentImageIds];
          newImageIds[index] = result.data.id;
          form.setValue("imageIds", newImageIds.filter(Boolean), {
            shouldValidate: true,
          });
        },
      }
    );

    e.target.value = "";
  };

  useEffect(() => {
    if (categories.length > 0 && ad) {
      const mc = categories.find((cat) => cat.id === ad.mainCategory.id);
      if (mc) {
        form.setValue("mainCategoryId", mc.id);
        setLevel1Categories(mc.subCategories ?? []);

        const categoryOne = mc.subCategories?.find(
          (category) => category.id === ad.categoryOne?.id
        );
        if (categoryOne) {
          form.setValue("categoryOneId", categoryOne.id);
          setLevel2Categories(categoryOne.subCategories ?? []);

          const categoryTwo = categoryOne.subCategories?.find(
            (category) => category.id === ad.categoryTwo?.id
          );
          if (categoryTwo) {
            form.setValue("categoryTwoId", categoryTwo.id);
            setLevel3Categories(categoryTwo.subCategories ?? []);

            const categoryThree = categoryTwo.subCategories?.find(
              (category) => category.id === ad.categoryThree?.id
            );
            if (categoryThree) {
              form.setValue("categoryThreeId", categoryThree.id);
            }
          }
        }
      }
    }
  }, [categories, ad, form]);

  useEffect(() => {
    console.log("Form population effect triggered:", { isLoading, ad: !!ad });
    if (!isLoading && ad) {
      console.log("Populating form with ad data:", ad);
      
      form.setValue("content", ad.content, { shouldValidate: false });

      const imageIds = ad.images?.map((img) => img.id) || [];
      form.setValue("imageIds", imageIds, { shouldValidate: false });

      const images = ad.images?.map((img) => ({
        id: img.id,
        url: `/api/images?imageName=${img.fileName}`,
      })) || [];
      setUploadedImages(images as any);

      const parsedDates = ad.dates?.map((d) => new Date(d)) || [];
      setSelectedDates(parsedDates);
      form.setValue("dates", parsedDates, { shouldValidate: false });
      
      form.setValue("postedBy", ad.postedBy || "");

      form.setValue("state", ad.state || "", { shouldValidate: false });
      form.setValue("sid", ad.sid || 0, { shouldValidate: false });
      form.setValue("city", ad.city || "", { shouldValidate: false });
      form.setValue("cid", ad.cid || 0, { shouldValidate: false });

      setState({ id: ad.sid, name: ad.state });
      setCity({ id: ad.cid, name: ad.city });

      form.setValue("backgroundColor", ad.backgroundColor || "#ffffff", { shouldValidate: false });
      form.setValue("textColor", ad.textColor || "#000000", { shouldValidate: false });

      if (ad.mainCategory) {
        form.setValue("mainCategoryId", ad.mainCategory.id, { shouldValidate: false });
      }
      if (ad.categoryOne) {
        form.setValue("categoryOneId", ad.categoryOne.id, { shouldValidate: false });
      }
      if (ad.categoryTwo) {
        form.setValue("categoryTwoId", ad.categoryTwo.id, { shouldValidate: false });
      }
      if (ad.categoryThree) {
        form.setValue("categoryThreeId", ad.categoryThree.id, { shouldValidate: false });
      }
      
      console.log("Form values after population:", form.getValues());
    }
  }, [ad, isLoading, form]);

  useEffect(() => {
    if (profile && !isLoadingProfile) {
      if (profile.secondary_number) {
        form.setValue("contactOne", +profile.secondary_number);
      } else {
        form.setValue("contactOne", +profile.phone_number);
      }
    }
  }, [profile, isLoadingProfile, form]);

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
    if (mcId && categories.length > 0) {
      const mainCategory = categories.find((category) => category.id === mcId);
      setLevel1Categories(mainCategory?.subCategories || []);

      if (ad && ad.mainCategory.id !== mcId) {
        form.setValue("categoryOneId", "");
        form.setValue("categoryTwoId", "");
        form.setValue("categoryThreeId", "");
        setLevel2Categories([]);
        setLevel3Categories([]);
      }
    }
  }, [mcId, categories, ad, form]);

  useEffect(() => {
    if (c1Id && level1Categories.length > 0) {
      const subCategory = level1Categories.find(
        (category) => category.id === c1Id
      );
      setLevel2Categories(subCategory?.subCategories || []);

      if (ad && ad.categoryOne?.id !== c1Id) {
        form.setValue("categoryTwoId", "");
        form.setValue("categoryThreeId", "");
        setLevel3Categories([]);
      }
    }
  }, [c1Id, level1Categories, ad, form]);

  useEffect(() => {
    if (c2Id && level2Categories.length > 0) {
      const subCategory = level2Categories.find(
        (category) => category.id === c2Id
      );
      setLevel3Categories(subCategory?.subCategories || []);

      if (ad && ad.categoryTwo?.id !== c2Id) {
        form.setValue("categoryThreeId", "");
      }
    }
  }, [c2Id, level2Categories, ad, form]);

  const onSubmit = (data: LineAdFormValues) => {
    console.log("Form data on submit:", data);
    console.log("Original ad data:", ad);

    if (
      ad &&
      data.mainCategoryId === ad.mainCategory.id &&
      data.categoryOneId === (ad.categoryOne?.id || "") &&
      data.categoryTwoId === (ad.categoryTwo?.id || "") &&
      data.categoryThreeId === (ad.categoryThree?.id || "") &&
      data.content === ad.content &&
      JSON.stringify(data.imageIds.sort()) ===
        JSON.stringify(ad.images?.map((img) => img.id).sort() || []) &&
      data.state === ad.state &&
      data.city === ad.city &&
      data.backgroundColor === (ad.backgroundColor || "#ffffff") &&
      data.textColor === (ad.textColor || "#000000") &&
      JSON.stringify(data.dates.map(d => new Date(d).toISOString()).sort()) === 
        JSON.stringify(ad.dates?.map(d => new Date(d).toISOString()).sort() || [])
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
    <div className="w-full max-w-6xl mx-auto px-4 py-4">
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="mainCategoryId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select main category" />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm">
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

            <FormField
              control={form.control}
              name="categoryTwoId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select type" />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select detailed type" />
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[80px] text-sm resize-none"
                        placeholder="Enter advertisement content..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="postedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Posted by" />
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

              <FormField
                control={form.control}
                name="contactOne"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        className="h-9 text-sm"
                        placeholder="Contact number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mb-6">
            <ColorPicker
              selectedBackgroundColor={form.watch("backgroundColor")}
              selectedTextColor={form.watch("textColor")}
              onChange={(backgroundColor, textColor) => {
                form.setValue("backgroundColor", backgroundColor);
                form.setValue("textColor", textColor);
              }}
              className="max-w-4xl"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="imageIds"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600 px-1">
                        Images (1-3)
                      </div>
                      <div className="text-xs text-gray-500 px-1 mb-2">
                        Recommended: 800x600px, Max 5MB, JPG/PNG format
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[0, 1, 2].map((index) => (
                          <Zoom key={index}>
                            <div className="relative aspect-[4/3] border border-dashed rounded-md overflow-hidden bg-gray-50">
                              {uploadedImages[index] ? (
                                <>
                                  <img
                                    src={
                                      uploadedImages[index].url ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/image.png";
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-4 w-4 bg-white text-gray-700 hover:bg-gray-200"
                                    onClick={() => removeImage(index)}
                                  >
                                    <X className="h-2 w-2" />
                                  </Button>
                                </>
                              ) : (
                                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                                  {isUploading &&
                                  uploadingVariables?.index === index ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                  ) : (
                                    <>
                                      <ImageIcon className="h-4 w-4 text-gray-400 mb-1" />
                                      <span className="text-xs text-gray-500">
                                        Upload
                                      </span>
                                    </>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, index)}
                                    disabled={isUploading}
                                  />
                                </label>
                              )}
                            </div>
                          </Zoom>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <div className="text-xs text-gray-600 px-1">Location</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="country-select-container">
                  <StateSelect
                    countryid={INDIA_ID}
                    onChange={setState}
                    placeHolder="Select State"
                    containerClassName="country-select-wrapper"
                    inputClassName="country-select-input"
                  />
                </div>
                <div className="country-select-container">
                  <CitySelect
                    countryid={INDIA_ID}
                    stateid={state?.id || ad?.sid || 0}
                    onChange={setCity}
                    placeHolder="Select City"
                    disabled={!state && !ad?.sid}
                    containerClassName="country-select-wrapper"
                    inputClassName="country-select-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-9 text-sm"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value.length > 0
                            ? `${field.value.length} publication date${
                                field.value.length > 1 ? "s" : ""
                              } selected`
                            : "Select publication dates"}
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
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>

                    {field.value.length > 0 && (
                      <div className="p-2 border rounded-md bg-gray-50 max-h-24 overflow-y-auto">
                        <div className="flex flex-wrap gap-1">
                          {field.value
                            .map((dateStr) => new Date(dateStr))
                            .sort((a, b) => a.getTime() - b.getTime())
                            .map((date, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs px-2 py-0.5"
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
                                  className="ml-1 text-gray-500 hover:text-gray-700"
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
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="px-6"
            >
              Back
            </Button>

            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
