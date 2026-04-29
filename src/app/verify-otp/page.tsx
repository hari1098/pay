"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { User } from "@/lib/types/user";
import PhoneVerification from "@/components/forms/phone-verification";
import { toast } from "sonner";

export default function VerifyOtpPage() {
  const router = useRouter();

  const { data: user, isLoading: isCheckingAuth, error } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/auth/profile");
        return data;
      } catch (error) {

        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, 
  });

  useEffect(() => {
    if (!isCheckingAuth) {

      if (error || !user) {
        toast.error("Please login first to verify your phone number");
        router.push("/");
        return;
      }

      if (user.phone_verified) {
        const dashboardPath = user.role === "USER" ? "/dashboard" : "/mgmt/dashboard";
        router.push(dashboardPath);
        return;
      }
    }
  }, [user, isCheckingAuth, error, router]);

  const handleVerificationSuccess = () => {
    const dashboardPath = user?.role === "USER" ? "/dashboard" : "/mgmt/dashboard";
    toast.success("Phone number verified successfully!");
    router.push(dashboardPath);
  };

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/auth/logout");
      return data;
    },
    onSuccess: () => {
      toast.success("Please login again to Continue");
      router.push("/");
    },
    onError: () => {

      router.push("/");
    }
  });

  const handleLogout = () => {
    logout();
  };

  const handleBack = () => {
    router.push("/");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if ( user?.phone_verified || error) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">Phone Verification</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <PhoneVerification
          phoneNumber={user?.phone_number ?? '0'}
          onVerificationSuccess={handleVerificationSuccess}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}