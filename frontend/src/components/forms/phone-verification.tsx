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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  sendVerificationOtpSchema,
  verifyAccountSchema,
  type SendVerificationOtpValues,
  type VerifyAccountValues 
} from "@/lib/validations";
import api from "@/lib/api";
import { Shield, Phone, ArrowLeft } from "lucide-react";

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerificationSuccess: () => void;
  onBack?: () => void;
}

export default function PhoneVerification({
  phoneNumber,
  onVerificationSuccess,
  onBack
}: PhoneVerificationProps) {
  const [step, setStep] = useState<"send" | "verify">("send");
  const [countdown, setCountdown] = useState(0);
  const [otpValue, setOtpValue] = useState("");
  const queryClient = useQueryClient();

  const sendOtpForm = useForm<SendVerificationOtpValues>({
    resolver: zodResolver(sendVerificationOtpSchema),
    defaultValues: {
      phone: phoneNumber,
    },
  });

  const verifyOtpForm = useForm<VerifyAccountValues>({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: {
      phone: phoneNumber,
      otp: "",
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (data: SendVerificationOtpValues) => {
      const response = await api.post("/auth/send-verification-otp", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Verification OTP sent to your phone");

      setOtpValue("");
      verifyOtpForm.reset({
        phone: phoneNumber,
        otp: "",
      });
      setStep("verify");
      setCountdown(600); 
      startCountdown();
    },
    onError: (error: any) => {
      console.error("Send OTP error:", error);
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    },
  });

  const verifyAccountMutation = useMutation({
    mutationFn: async (data: VerifyAccountValues) => {
      const response = await api.post("/auth/verify-account", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Phone number verified successfully!");

      queryClient.invalidateQueries({ queryKey: ["user"] });
      onVerificationSuccess();
    },
    onError: (error: any) => {
      console.error("Verify OTP error:", error);
      const errorMessage = error.response?.data?.message || "Invalid or expired OTP. Please try again.";
      toast.error(errorMessage);

      setOtpValue("");
      verifyOtpForm.setValue("otp", "");
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

  function onSendOtp(data: SendVerificationOtpValues) {
    sendOtpMutation.mutate(data);
  }

  function onVerifyOtp(data: VerifyAccountValues) {

    const submitData = {
      phone: phoneNumber,
      otp: otpValue,
    };
    verifyAccountMutation.mutate(submitData);
  }

  const handleResendOtp = () => {

    setOtpValue("");
    verifyOtpForm.setValue("otp", "");
    sendOtpMutation.mutate({ phone: phoneNumber });
  };

  if (step === "send") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
          <CardTitle>Verify Your Phone Number</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...sendOtpForm}>
            <form onSubmit={sendOtpForm.handleSubmit(onSendOtp)} className="space-y-4">
              <FormField
                control={sendOtpForm.control}
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
                          disabled
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
                {sendOtpMutation.isPending ? "Sending OTP..." : "Send Verification OTP"}
              </Button>

              {onBack && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <Shield className="h-10 w-10 text-blue-600" />
        </div>
        <CardTitle>Enter Verification Code</CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to +91 {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...verifyOtpForm}>
          <form onSubmit={verifyOtpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Verification Code</label>
              <Input
                placeholder="123456"
                maxLength={6}
                className="text-center text-xl tracking-widest"
                value={otpValue}
                onChange={(e) => {

                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 6) {
                    setOtpValue(value);

                    verifyOtpForm.setValue("otp", value);
                  }
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={verifyAccountMutation.isPending || otpValue.length !== 6}
            >
              {verifyAccountMutation.isPending ? "Verifying..." : "Verify Phone Number"}
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
                  {sendOtpMutation.isPending ? "Sending..." : "Resend Verification Code"}
                </Button>
              )}
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {

                  setOtpValue("");
                  verifyOtpForm.setValue("otp", "");
                  setStep("send");
                }}
                disabled={verifyAccountMutation.isPending}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Phone Entry
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}