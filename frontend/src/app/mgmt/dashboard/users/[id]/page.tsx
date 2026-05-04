"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Role } from "@/lib/enum/roles.enum";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}`);
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">User Details</h1>
        <p className="text-destructive">Unable to load user details.</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex gap-2 mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push("/mgmt/dashboard/profile")}
        >
          Go to My Profile
        </Button>
      </div>
      <Card className="pb-5">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>View all information for this user.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-muted-foreground mb-1">
                Name
              </span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground mb-1">
                Email
              </span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground mb-1">
                Phone Number
              </span>
              <span className="font-medium">{user.phone_number || "-"}</span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground mb-1">
                Status
              </span>
              <Badge
                variant="outline"
                className={
                  user.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground mb-1">
                Role
              </span>
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                {user.role?.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground mb-1">
                Type
              </span>
              {user.admin ? (
                <Badge
                  variant="outline"
                  className="bg-purple-100 text-purple-800"
                >
                  Admin
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-orange-100 text-orange-800"
                >
                  Customer
                </Badge>
              )}
            </div>
            {user.customer && (
              <>
                <div>
                  <span className="block text-xs text-muted-foreground mb-1">
                    Country
                  </span>
                  <span className="font-medium">
                    {user.customer.country || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground mb-1">
                    State
                  </span>
                  <span className="font-medium">
                    {user.customer.state || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground mb-1">
                    City
                  </span>
                  <span className="font-medium">
                    {user.customer.city || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground mb-1">
                    Gender
                  </span>
                  <span className="font-medium">
                    {user.customer.gender === 1
                      ? "Male"
                      : user.customer.gender === 2
                      ? "Female"
                      : "Other"}
                  </span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
