"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, Customer } from "@/lib/types/user";
import api from "@/lib/api";

const basicInfoSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

interface BasicInfoFormProps {
  user: User;
  customer?: Customer;
}

export function BasicInfoForm({ user, customer }: BasicInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: BasicInfoFormValues) => {
      const response = await api.patch("/users/me", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    },
  });

  function onSubmit(data: BasicInfoFormValues) {
    setIsLoading(true);
    updateUserMutation.mutate(data, {
      onSettled: () => setIsLoading(false),
    });
  }

  return (
    <Card className="pb-5">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={user.phone_number || "-"}
                  readOnly
                  tabIndex={-1}
                  aria-label="Phone Number"
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <FormLabel>Status</FormLabel>
                <Input
                  value={user.isActive ? "Active" : "Inactive"}
                  readOnly
                  tabIndex={-1}
                  aria-label="Status"
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              {customer && (
                <>
                  <div>
                    <FormLabel>Country</FormLabel>
                    <Input
                      value={customer.country || "-"}
                      readOnly
                      tabIndex={-1}
                      aria-label="Country"
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <FormLabel>State</FormLabel>
                    <Input
                      value={customer.state || "-"}
                      readOnly
                      tabIndex={-1}
                      aria-label="State"
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <FormLabel>City</FormLabel>
                    <Input
                      value={customer.city || "-"}
                      readOnly
                      tabIndex={-1}
                      aria-label="City"
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <FormLabel>Gender</FormLabel>
                    <Input
                      value={
                        customer.gender === 1
                          ? "Male"
                          : customer.gender === 2
                          ? "Female"
                          : "Other"
                      }
                      readOnly
                      tabIndex={-1}
                      aria-label="Gender"
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </>
              )}
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="pt-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
