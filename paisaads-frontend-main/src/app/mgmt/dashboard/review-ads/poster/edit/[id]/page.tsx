"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { AdStatus } from "@/lib/enum/ad-status";
import { AdType } from "@/lib/enum/ad-type";
import { PostedBy } from "@/lib/enum/posted-by";
import { Role } from "@/lib/enum/roles.enum";
import { PageType } from "@/lib/enum/page-type";
import type { MainCategory, SubCategory } from "@/lib/types/category";
import { PosterAd } from "@/lib/types/posterAd";
import type { Media } from "@/lib/types/media";
import type { User } from "@/lib/types/user";
import {
  EDITOR_STATUSES,
  formatOrderId,
  getStatusVariant,
  INDIA_ID,
  PAYMENT_METHODS,
  REVIEWER_STATUSES,
} from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isValid } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CalendarIcon,
  Check,
  Clock,
  FileText,
  ImageIcon,
  Loader2,
  MapPin,
  MessageSquare,
  Save,
  Tag,
  X,
  CreditCard,
  UserIcon,
  Phone,
  Layout,
  Monitor,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAdNavigation } from "@/hooks/useAdNavigation";
import type React from "react";
import { useEffect, useState, useRef } from "react";
import { CitySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import Zoom from "react-medium-image-zoom";
import { toast } from "sonner";

export default function EditPosterAd() {
  const params = useParams();
  const router = useRouter();
  const { goBack } = useAdNavigation(AdType.POSTER, params.id as string);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<AdStatus | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const prevAdId = useRef<string | undefined>(undefined);

  const { data: currentUser } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/profile");
      return data;
    },
  });

  const isSuperAdmin = currentUser?.role === Role.SUPER_ADMIN;
  const isEditorRole = currentUser?.role === Role.EDITOR || isSuperAdmin;

  const [postedBy, setPostedBy] = useState("");
  const [pageType, setPageType] = useState<PageType>(PageType.HOME);
  const [side, setSide] = useState("");
  const [positionNumber, setPositionNumber] = useState<number>(1);
  const [mainCategoryId, setMainCategoryId] = useState("");
  const [categoryOneId, setCategoryOneId] = useState("");
  const [categoryTwoId, setCategoryTwoId] = useState("");
  const [categoryThreeId, setCategoryThreeId] = useState("");
  const [uploadedImage, setUploadedImage] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [formattedDates, setFormattedDates] = useState<string[]>([]);

  const [state, setState] = useState<any>(null);
  const [city, setCity] = useState<any>(null);
  const [stateValue, setStateValue] = useState("");
  const [stateId, setStateId] = useState<number | null>(null);
  const [cityValue, setCityValue] = useState("");
  const [cityId, setCityId] = useState<number | null>(null);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [paymentProofId, setPaymentProofId] = useState("");
  const [paymentProofImage, setPaymentProofImage] = useState<{
    id: string;
    url: string;
  } | null>(null);

  const [level1Categories, setLevel1Categories] = useState<SubCategory[]>([]);
  const [level2Categories, setLevel2Categories] = useState<SubCategory[]>([]);
  const [level3Categories, setLevel3Categories] = useState<SubCategory[]>([]);

  const {
    data: ad,
    isLoading,
    error,
    refetch: refetchAd,
  } = useQuery({
    queryKey: ["posterAd", params.id],
    queryFn: async () => {
      const response = await api.get<PosterAd>(`/poster-ad/${params.id}`);
      return response.data;
    },
  });

  const { data: adComments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ["adComments", params.id],
    queryFn: async () => {
      const response = await api.get(
        `/ad-comments/ad/${AdType.POSTER}/${params.id}`
      );
      return response.data;
    },
    enabled: !!params.id,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<MainCategory[]>("/categories/tree");
      return response.data;
    },
  });

  const {
    mutate: uploadImage,
    isPending: isUploading,
    variables: uploadingVariables,
  } = useMutation({
    mutationFn: async ({
      file,
      index,
      isPaymentProof = false,
    }: {
      file: File;
      index: number;
      isPaymentProof?: boolean;
    }) => {
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
        isPaymentProof,
      };
    },
    onSuccess: (result) => {
      if (result.isPaymentProof) {
        setPaymentProofId(result.data.id);
        setPaymentProofImage({
          id: result.data.id,
          url: result.data.fileName,
        });
        toast.success("Payment proof uploaded successfully");
      } else {

        const newUploadedImage = {
          id: result.data.id,
          url: result.data.fileName,
        };
        setUploadedImage(newUploadedImage);

        toast.success("Image uploaded successfully");
      }
    },
    onError: () => {
      toast.error("Failed to upload image", {
        description: "Please try again or use a different image.",
      });
    },
  });

  const { mutate: updateAd, isPending: isUpdatingAd } = useMutation({
    mutationFn: async (data: any) => {
      return await api.patch(`/poster-ad/admin/${params.id}`, data);
    },
    onSuccess: () => {
      toast.success("Ad details updated successfully");
      refetchAd();
    },
    onError: (error) => {
      toast.error("Failed to update ad details");
      console.error("Error updating ad details:", error);
    },
  });

  const { mutate: updatePayment, isPending: isUpdatingPayment } = useMutation({
    mutationFn: async (data: any) => {
      if (!ad?.payment?.id) {

        return await api.post("/payment", {
          ...data,
          posterAdId: params.id,
        });
      } else {

        return await api.patch(`/payment/${ad.payment.id}`, data);
      }
    },
    onSuccess: () => {
      toast.success("Payment details updated successfully");
      refetchAd();
    },
    onError: (error) => {
      toast.error("Failed to update payment details");
      console.error("Error updating payment details:", error);
    },
  });

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: async (data: { actionType: AdStatus; comment: string }) => {
      return await api.post("/ad-comments", {
        ...data,
        posterAdId: params.id,
        adType: AdType.POSTER,
      });
    },
    onSuccess: () => {
      toast.success("Ad status updated successfully");
      setComment("");
      setSelectedStatus("");
      refetchAd();
      queryClient.invalidateQueries({ queryKey: ["adComments", params.id] });

      setTimeout(() => goBack(), 1000);
    },
    onError: (error) => {
      toast.error("Failed to update ad status");
      console.error("Error updating ad status:", error);
    },
  });

  useEffect(() => {
    if (!ad) return;

    if (prevAdId.current !== ad.id) {
      setIsFormInitialized(false);
      prevAdId.current = ad.id;
    }

    if (isFormInitialized) return;

    setPostedBy(ad.postedBy);
    console.log("Pos", ad.position);

    if (ad.position) {
      setPageType(ad.position.pageType === 'HOME' ? PageType.HOME : PageType.CATEGORY);
      setSide(ad.position.side || "");
      setPositionNumber(ad.position.position || 1);
    }

    setMainCategoryId(ad.mainCategory.id);
    setCategoryOneId(ad.categoryOne?.id || "");
    setCategoryTwoId(ad.categoryTwo?.id || "");
    setCategoryThreeId(ad.categoryThree?.id || "");

    setStateValue(ad.state);
    setStateId(ad.sid);
    setCityValue(ad.city);
    setCityId(ad.cid);

    const parsedDates = ad.dates.map((d) => new Date(d));
    setSelectedDates(parsedDates);
    setFormattedDates(ad.dates);

    const image = {
      id: ad.image.id,
      url: ad.image.fileName,
    };
    setUploadedImage(image);

    if (ad.payment) {
      setPaymentMethod(ad.payment.method);
      setPaymentAmount(ad.payment.amount);
      setPaymentDetails(ad.payment.details || "");

      if (ad.payment.proof) {
        setPaymentProofId(ad.payment.proof.id);
        setPaymentProofImage({
          id: ad.payment.proof.id,
          url: `/api/images?imageName=${ad.payment.proof.fileName}`,
        });
      }
    }

    setIsFormInitialized(true);
  }, [ad, isFormInitialized]);

  useEffect(() => {
    if (mainCategoryId && categories.length > 0) {
      const mainCategory = categories.find((cat) => cat.id === mainCategoryId);
      setLevel1Categories(mainCategory?.subCategories || []);

      if (ad?.mainCategory.id !== mainCategoryId) {
        setCategoryOneId("");
        setCategoryTwoId("");
        setCategoryThreeId("");
        setLevel2Categories([]);
        setLevel3Categories([]);
      }
    }
  }, [mainCategoryId, categories, ad]);

  useEffect(() => {
    if (categoryOneId && level1Categories.length > 0) {
      const categoryOne = level1Categories.find(
        (cat) => cat.id === categoryOneId
      );
      setLevel2Categories(categoryOne?.subCategories || []);

      if (ad?.categoryOne?.id !== categoryOneId) {
        setCategoryTwoId("");
        setCategoryThreeId("");
        setLevel3Categories([]);
      }
    }
  }, [categoryOneId, level1Categories, ad]);

  useEffect(() => {
    if (categoryTwoId && level2Categories.length > 0) {
      const categoryTwo = level2Categories.find(
        (cat) => cat.id === categoryTwoId
      );
      setLevel3Categories(categoryTwo?.subCategories || []);

      if (ad?.categoryTwo?.id !== categoryTwoId) {
        setCategoryThreeId("");
      }
    }
  }, [categoryTwoId, level2Categories, ad]);

  useEffect(() => {
    if (side === "CENTER_TOP" || side === "CENTER_BOTTOM") {
      setPositionNumber(1);
    }
  }, [side]);

  const handleStateChange = (stateObj: any) => {
    setState(stateObj);
    setStateValue(stateObj.name);
    setStateId(stateObj.id);
    setCityValue("");
    setCityId(null);
    setCity(null);
  };

  const handleCityChange = (cityObj: any) => {
    setCity(cityObj);
    setCityValue(cityObj.name);
    setCityId(cityObj.id);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    uploadImage({ file, index, isPaymentProof: false });
    e.target.value = ""; 
  };

  const handlePaymentProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    uploadImage({ file, index: 0, isPaymentProof: true });
    e.target.value = ""; 
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  const removePaymentProof = () => {
    setPaymentProofId("");
    setPaymentProofImage(null);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !isValid(date)) return;

    const newDates = [...selectedDates];

    const dateIndex = newDates.findIndex(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );

    if (dateIndex !== -1) {

      newDates.splice(dateIndex, 1);
    } else {

      if (newDates.length >= 30) {
        toast.error("Maximum dates reached", {
          description: "You can select up to 30 dates",
        });
        return;
      }
      newDates.push(date);
    }

    setSelectedDates(newDates);

    const formatted = newDates.map((d) => format(d, "yyyy-MM-dd"));
    setFormattedDates(formatted);
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please provide a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStatus({
        actionType: selectedStatus,
        comment: comment.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdUpdate = async () => {
    if (!uploadedImage) {
      toast.error("Image is required");
      return;
    }
    if (!mainCategoryId) {
      toast.error("Main category is required");
      return;
    }

    if (!stateValue || !cityValue) {
      toast.error("Location is required");
      return;
    }

    if (formattedDates.length === 0) {
      toast.error("At least one publication date is required");
      return;
    }

    if (!side || !positionNumber) {
      toast.error("Position side and number are required");
      return;
    }

    const adData = {
      mainCategoryId,
      categoryOneId: categoryOneId || undefined,
      categoryTwoId: categoryTwoId || undefined,
      categoryThreeId: categoryThreeId || undefined,
      imageId: uploadedImage?.id || undefined,
      state: stateValue,
      sid: stateId,
      city: cityValue,
      cid: cityId,
      dates: formattedDates,
      postedBy,
      position: {
        adType: 'POSTER' as const,
        pageType,
        side,
        position: positionNumber,
      },
    };

    await updateAd(adData);
  };

  const handlePaymentUpdate = async () => {
    if (!paymentMethod) {
      toast.error("Payment method is required");
      return;
    }

    if (
      !paymentAmount ||
      isNaN(Number(paymentAmount)) ||
      Number(paymentAmount) <= 0
    ) {
      toast.error("Valid payment amount is required");
      return;
    }

    const paymentData = {
      method: paymentMethod,
      amount: Number(paymentAmount),
      details: paymentDetails,
      proofImageId: paymentProofId || undefined,
      posterAdId: params.id,
    };

    await updatePayment(paymentData);
  };

  const groupDatesByMonth = (dates: Date[]) => {
    if (!dates || dates.length === 0) return [];

    const datesByMonth: Record<string, Date[]> = {};
    const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());

    sortedDates.forEach((date) => {
      const monthYear = format(date, "MMMM yyyy");
      if (!datesByMonth[monthYear]) {
        datesByMonth[monthYear] = [];
      }
      datesByMonth[monthYear].push(date);
    });

    return Object.entries(datesByMonth).map(([monthYear, datesInMonth]) => {
      return {
        monthYear,
        dates: datesInMonth,
      };
    });
  };

  const [isSavingAll, setIsSavingAll] = useState(false);

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    try {
      await handleAdUpdate();
      await handlePaymentUpdate();
      toast.success("All changes saved successfully");

      setTimeout(() => goBack(), 1000);
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setIsSavingAll(false);
    }
  };

  if (
    isLoading ||
    isLoadingCategories ||
    isLoadingComments ||
    !currentUser ||
    !isFormInitialized
  ) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading ad details...</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Failed to load ad details</h3>
            <p className="text-gray-600">Please try again later</p>
          </div>
          <Button onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Poster Ads
          </Button>
        </div>
      </div>
    );
  }

  const groupedDates = groupDatesByMonth(selectedDates);
  const availableStatuses = isEditorRole ? EDITOR_STATUSES : REVIEWER_STATUSES;
  const statusOptions = isSuperAdmin
    ? availableStatuses
    : availableStatuses.filter((status) => {
        if (
          (isEditorRole &&
            ad.status === AdStatus.FOR_REVIEW &&
            status === AdStatus.PUBLISHED) ||
          status === AdStatus.PAUSED
        ) {
          return false;
        }
        return status !== ad.status;
      });

  const imageContainerClass = "relative aspect-[3/4] border border-gray-300 border-dashed rounded-md overflow-hidden bg-gray-50";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 pt-0">
        <div className="bg-white rounded-lg shadow-sm border mb-4 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goBack}
                className="h-8 px-3"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
              <h1 className="text-base font-semibold">
                {formatOrderId(ad.sequenceNumber, AdType.POSTER)}
              </h1>
            </div>

            <Badge
              variant={getStatusVariant(ad.status) as any}
              className="text-xs px-2 py-1"
            >
              {ad.status.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="space-y-3">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <ImageIcon className="h-3 w-3" /> Poster Image
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-2 space-y-3">
                <div className={imageContainerClass}>
                  {uploadedImage ? (
                    <>
                      <Zoom>
                        <Image
                          src={`/api/images?imageName=${uploadedImage.url}`}
                          alt="Poster Image"
                          fill
                          className="object-cover"
                        />
                      </Zoom>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeImage()}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                      {isUploading &&
                      uploadingVariables?.index === 0 &&
                      !uploadingVariables?.isPaymentProof ? (
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">
                            Upload Image
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 0)}
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <Tag className="h-3 w-3" /> Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-2 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Main Category</Label>
                  <Select
                    value={mainCategoryId}
                    onValueChange={setMainCategoryId}
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {level1Categories.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Subcategory</Label>
                    <Select
                      value={categoryOneId}
                      onValueChange={setCategoryOneId}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {level1Categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {level2Categories.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">
                      Specific Category
                    </Label>
                    <Select
                      value={categoryTwoId}
                      onValueChange={setCategoryTwoId}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select specific category" />
                      </SelectTrigger>
                      <SelectContent>
                        {level2Categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {level3Categories.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">
                      Final Category
                    </Label>
                    <Select
                      value={categoryThreeId}
                      onValueChange={setCategoryThreeId}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select final category" />
                      </SelectTrigger>
                      <SelectContent>
                        {level3Categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <MapPin className="h-3 w-3" /> Location
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-2 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">State</Label>
                  <div className="country-select-container">
                    <StateSelect
                      countryid={INDIA_ID}
                      onChange={handleStateChange}
                      placeHolder="Select State"
                      containerClassName="country-select-wrapper"
                      inputClassName="country-select-input text-sm h-8"

                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">City</Label>
                  <div className="country-select-container">
                    <CitySelect
                      countryid={INDIA_ID}
                      stateid={stateId || ad?.sid}
                      onChange={handleCityChange}
                      placeHolder="Select City"
                      disabled={!stateId && !ad?.sid}
                      containerClassName="country-select-wrapper"
                      inputClassName="country-select-input text-sm h-8"

                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <Phone className="h-3 w-3" /> Posted By & Position
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-2 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Posted By</Label>
                  <Select value={postedBy} onValueChange={setPostedBy}>
                    <SelectTrigger className="h-8 text-sm">
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
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-600 flex items-center gap-1">
                    <Layout className="h-3 w-3" />
                    Update Position
                  </Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-gray-500">Page Type</Label>
                      <Select value={pageType} onValueChange={(value) => setPageType(value as PageType)}>
                        <SelectTrigger className="h-7 text-sm">
                          <SelectValue placeholder="Select page type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HOME">
                            <div className="flex items-center gap-2">
                              <Monitor className="h-3 w-3" />
                              Home Page
                            </div>
                          </SelectItem>
                          <SelectItem value="CATEGORY">
                            <div className="flex items-center gap-2">
                              <Layout className="h-3 w-3" />
                              Category Pages
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Side</Label>
                      <Select value={side} onValueChange={setSide}>
                        <SelectTrigger className="h-7 text-sm">
                          <SelectValue placeholder="Select side" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LEFT_SIDE">
                            <div className="flex items-center gap-2">
                              <Layers className="h-3 w-3" />
                              Left Side
                            </div>
                          </SelectItem>
                          <SelectItem value="RIGHT_SIDE">
                            <div className="flex items-center gap-2">
                              <Layers className="h-3 w-3" />
                              Right Side
                            </div>
                          </SelectItem>
                          <SelectItem value="CENTER_TOP">
                            <div className="flex items-center gap-2">
                              <Layers className="h-3 w-3" />
                              Center Top
                            </div>
                          </SelectItem>
                          <SelectItem value="CENTER_BOTTOM">
                            <div className="flex items-center gap-2">
                              <Layers className="h-3 w-3" />
                              Center Bottom
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {(side === "LEFT_SIDE" || side === "RIGHT_SIDE") && (
                      <div>
                        <Label className="text-xs text-gray-500">Position Number</Label>
                        <Select value={positionNumber.toString()} onValueChange={(value) => setPositionNumber(Number(value))}>
                          <SelectTrigger className="h-7 text-sm">
                            <SelectValue placeholder="Select position number" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                <div className="flex items-center gap-2">
                                  <Layers className="h-3 w-3" />
                                  Position {num}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <Calendar className="h-3 w-3" /> Publication Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-2 space-y-3">
                {selectedDates.length > 0 && (
                  <div className="p-2 border rounded-md bg-gray-50 max-h-32 overflow-y-auto">
                    <div className="text-xs font-medium mb-1">
                      Selected: {selectedDates.length}
                    </div>
                    <div className="space-y-2">
                      {groupedDates.map((group, groupIndex) => (
                        <div key={groupIndex}>
                          <div className="text-xs text-gray-700 mb-1">
                            {group.monthYear}
                          </div>
                          <div className="grid grid-cols-4 gap-1">
                            {group.dates.map((date, dateIndex) => (
                              <Badge
                                key={dateIndex}
                                variant="secondary"
                                className="text-xs px-1 py-0.5 justify-center"
                              >
                                {format(date, "d")}
                                <button
                                  type="button"
                                  onClick={() => handleDateSelect(date)}
                                  className="ml-1 text-gray-500 hover:text-gray-700"
                                >
                                  <X className="h-2 w-2" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {selectedDates.length > 0
                        ? `${selectedDates.length} date${
                            selectedDates.length > 1 ? "s" : ""
                          } selected`
                        : "Select dates"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={(dates) => {
                        if (dates) {
                          setSelectedDates(dates);
                          setFormattedDates(
                            dates.map((date) => format(date, "yyyy-MM-dd"))
                          );
                        } else {
                          setSelectedDates([]);
                          setFormattedDates([]);
                        }
                      }}
                      fromDate={new Date()}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <CreditCard className="h-3 w-3" /> Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-2 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">
                    Payment Method
                  </Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      ₹
                    </span>
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="pl-6 h-8 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Reference</Label>
                  <Input
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    placeholder="Transaction ID, etc."
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Payment Proof</Label>
                  <div className="flex items-center gap-2">
                    {paymentProofImage ? (
                      <Zoom>
                        <div className="relative w-16 h-16 border rounded-md overflow-hidden">
                          <img
                            src={paymentProofImage.url || "/placeholder.svg"}
                            alt="Payment proof"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-4 w-4"
                            onClick={removePaymentProof}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </div>
                      </Zoom>
                    ) : (
                      <div className="relative h-16 w-16 border border-gray-300 border-dashed rounded-md overflow-hidden bg-gray-50">
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                          {isUploading && uploadingVariables?.isPaymentProof ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                          ) : (
                            <>
                              <ImageIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                Upload
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePaymentProofUpload}
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <UserIcon className="h-3 w-3" /> Update Status
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-2 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">New Status</Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={(value) =>
                      setSelectedStatus(value as AdStatus)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.length > 0 ? (
                        statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            <Badge
                              variant={getStatusVariant(status) as any}
                              className="text-xs"
                            >
                              {status.replace(/_/g, " ")}
                            </Badge>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                          No status changes available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Comment</Label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment explaining this status change"
                    className="min-h-[80px] text-sm"
                  />
                </div>

                <Button
                  className="w-full h-8 text-xs"
                  onClick={handleStatusUpdate}
                  disabled={!selectedStatus || !comment.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-3 w-3" />
                      Update Status
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200 flex-1">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <MessageSquare className="h-3 w-3" /> Status History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-64">
                  {isLoadingComments ? (
                    <div className="space-y-2">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : adComments && adComments.length > 0 ? (
                    <div className="space-y-3">
                      {adComments.map((comment: any, index: number) => (
                        <div
                          key={comment.id || index}
                          className="border rounded-md p-3 text-xs bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  getStatusVariant(comment.actionType) as any
                                }
                                className="text-xs px-1 py-0.5"
                              >
                                {comment.actionType.replace(/_/g, " ")}
                              </Badge>
                              <span className="text-xs font-medium">
                                {comment.user?.name || "Unknown User"}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(
                                new Date(comment.created_at),
                                "MMM d, h:mm a"
                              )}
                            </span>
                          </div>
                          <p className="text-xs">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      No status updates yet
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 pb-6">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={isSavingAll || isUpdatingAd || isUpdatingPayment}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button
            onClick={handleSaveAll}
            disabled={isSavingAll || isUpdatingAd || isUpdatingPayment}
          >
            {isSavingAll || isUpdatingAd || isUpdatingPayment ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save All
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
