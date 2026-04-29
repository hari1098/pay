"use client";

import { useQuery } from "@tanstack/react-query";
import type { Customer, User } from "@/lib/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { BasicInfoForm } from "@/components/profile/basic-info-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";

export default function CustomerProfilePage() {
  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/profile");
      return data;
    },
  });

  const { data: customer, isLoading: isCustomerLoading } = useQuery<Customer>({
    queryKey: ["customer"],
    queryFn: async () => {
      const { data } = await api.get("/users/customer/me");
      return data;
    },
    enabled: !!user,
  });

  const isLoading = isUserLoading || isCustomerLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Separator />
        <div className="space-y-6">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            There was an error loading your profile. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>
      <div className="space-y-8">
        <BasicInfoForm user={user} customer={customer} />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
