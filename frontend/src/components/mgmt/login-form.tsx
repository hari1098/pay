"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
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
import { loginFormSchema, type LoginFormValues } from "@/lib/validations";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/enum/roles.enum";

interface ManagementLoginFormProps {
  onSuccess: () => void;
}

export function ManagementLoginForm({ onSuccess }: ManagementLoginFormProps) {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {

      const response = await api.post("/auth/login", {
        emailOrPhone: data.emailOrPhone,
        password: data.password,
      });

      if (
        response.data.user &&
        [Role.EDITOR, Role.REVIEWER, Role.SUPER_ADMIN].includes(
          response.data.user.role
        )
      ) {
        return response.data;
      } else {
        console.log("User role:", response.data.user?.role);

        throw new Error(
          "Access denied. You do not have management privileges."
        );
      }
    },
    onSuccess: (data) => {
      toast.success("Login successful", {
        description: "Welcome to the management dashboard",
      });

      if (data.user && !data.user.phone_verified) {
        window.location.href = "/verify-otp";
      } else {

        onSuccess();
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);

      if (
        error.message ===
        "Access denied. You do not have management privileges."
      ) {
        toast.error("Access denied", {
          description: "You do not have management privileges",
        });
      } else {
        toast.error("Login failed", {
          description: "Invalid email or password. Please try again.",
        });
      }
    },
  });

  async function onSubmit(data: LoginFormValues) {
    loginMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="emailOrPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or Phone</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter email or phone"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
