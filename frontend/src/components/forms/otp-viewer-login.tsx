"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  sendLoginOtpSchema,
  verifyLoginOtpSchema,
  type SendLoginOtpValues,
  type VerifyLoginOtpValues 
} from "@/lib/validations";
import api from "@/lib/api";
import { Phone, Shield, ArrowLeft } from "lucide-react";

interface OtpViewerLoginProps {
  onSuccess: () => void;
  onBack?: () => void;
}

export default function OtpViewerLogin({
  onSuccess,
  onBack
}: OtpViewerLoginProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otpValue, setOtpValue] = useState("");
  const queryClient = useQueryClient();

  const phoneForm = useForm<SendLoginOtpValues>({
    resolver: zodResolver(sendLoginOtpSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpForm = useForm<VerifyLoginOtpValues>({
    resolver: zodResolver(verifyLoginOtpSchema),
    defaultValues: {
      phone: "",
      otp: "",
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (data: SendLoginOtpValues) => {
      const response = await api.post("/auth/send-otp", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("OTP sent to your phone");
      setOtpValue("");
      otpForm.reset({
        phone: phoneNumber,
        otp: "",
      });
      setStep("otp");
      setCountdown(300); 
      startCountdown();
    },
    onError: (error: any) => {
      console.error("Send OTP error:", error);
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: VerifyLoginOtpValues) => {
      const response = await api.post("/auth/verify-otp", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Login successful!");

      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess();
    },
    onError: (error: any) => {
      console.error("Verify OTP error:", error);
      const errorMessage = error.response?.data?.message || "Invalid or expired OTP. Please try again.";
      toast.error(errorMessage);

      setOtpValue("");
      otpForm.setValue("otp", "");
    },
  });

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  function onSendOtp(data: SendLoginOtpValues) {
    setPhoneNumber(data.phone);
    sendOtpMutation.mutate(data);
  }

  function onVerifyOtp(data: VerifyLoginOtpValues) {

    const submitData = {
      phone: phoneNumber,
      otp: otpValue,
    };
    verifyOtpMutation.mutate(submitData);
  }

  const handleResendOtp = () => {

    setOtpValue("");
    otpForm.setValue("otp", "");
    sendOtpMutation.mutate({ phone: phoneNumber });
  };

  if (step === "phone") {
    return (
      <div className="space-y-4">
        <div className="text-center">
        </div>

        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onSendOtp)} className="space-y-4">
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="1234567890"
                        className="pl-10"
                        {...field}
                        onChange={(e) => {

                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
            </Button>

            {onBack && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Enter OTP</h3>
        <p className="text-sm text-muted-foreground mb-4">
          We've sent a 6-digit code to +91 {phoneNumber}
        </p>
      </div>

      <Form {...otpForm}>
        <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Verification Code</label>
            <Input
              maxLength={6}
              className="text-center text-xl tracking-widest"
              value={otpValue}
              onChange={(e) => {

                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 6) {
                  setOtpValue(value);

                  otpForm.setValue("otp", value);
                }
              }}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={verifyOtpMutation.isPending || otpValue.length !== 6}
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Login"}
          </Button>

          <div className="text-center space-y-2">
            {countdown > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend OTP in {formatTime(countdown)}
              </p>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOtp}
                disabled={sendOtpMutation.isPending}
                className="text-primary hover:text-primary/80"
              >
                {sendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
              </Button>
            )}
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {

                setOtpValue("");
                otpForm.setValue("otp", "");
                setStep("phone");
              }}
              disabled={verifyOtpMutation.isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Phone Entry
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}