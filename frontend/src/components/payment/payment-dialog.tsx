"use client";

import type React from "react";
import Zoom from 'react-medium-image-zoom'
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Loader2, Upload } from "lucide-react";
import api from "@/lib/api";
import { AdType } from "@/lib/enum/ad-type";

const paymentFormSchema = z.object({
  method: z.string().min(1, { message: "Payment method is required" }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number" }),
  details: z.string().min(1, { message: "Payment details are required" }),
  proofImageId: z.string(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentDialogProps {
  adId: string;
  type: AdType;
}

export function PaymentDialog({ adId, type }: PaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      method: "",
      amount: 0,
      details: "",
      proofImageId: "",
    },
  });

  const { mutate: submitPayment, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: PaymentFormValues) => {
      const adInfo: Record<string, string> = {};
      if (type === AdType.LINE) {
        adInfo.lineAdId = adId;
      } else if (type === AdType.POSTER) {
        adInfo.posterAdId = adId;
      } else if (type === AdType.VIDEO) {
        adInfo.videoAdId = adId;
      }
      const response = await api.post("/payment", {
        ...data,
        ...adInfo,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Payment submitted successfully");
      setOpen(false);
      form.reset();
      setUploadedImage(null);

      queryClient.invalidateQueries({ queryKey: ["myAds"] });
    },
    onError: (error) => {
      toast.error("Failed to submit payment", {
        description: "Please check your payment details and try again.",
      });
      console.error("Payment error:", error);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadedImage({
        id: response.data.id,
        url: response.data.fileName,
      });

      form.setValue("proofImageId", response.data.id, { shouldValidate: true });
      toast.success("Payment proof uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload payment proof", {
        description: "Please try again or use a different image.",
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      e.target.value = ""; 
    }
  };

  const onSubmit = (data: PaymentFormValues) => {
    submitPayment(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CreditCard className="mr-2 h-4 w-4" />
          Make Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Make Payment for Advertisement</DialogTitle>
          <DialogDescription>
            Complete the payment details below to proceed with your
            advertisement.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the payment amount in rupees
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter transaction details, reference numbers, etc."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proofImageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Proof</FormLabel>
                  <div className="mt-2">
                    {uploadedImage ? (
                      <div className="relative rounded-md border overflow-hidden">
                        <Zoom>
                          <img
                          src={`/api/images?imageName=${uploadedImage.url}`}
                          alt="Payment proof"
                          className="w-full h-40 object-cover"
                        />
                        </Zoom>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setUploadedImage(null);
                            form.setValue("proofImageId", "", {
                              shouldValidate: true,
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {isUploading ? (
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mb-3 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG or PDF (MAX. 5MB)
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Payment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
