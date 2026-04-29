"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
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
interface PostAdLoginFormProps {
  onSuccess: () => void;
}
export function PostAdLoginForm({ onSuccess }: PostAdLoginFormProps) {
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
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Login successful", {
        description: "You are now logged in to your account",
      });

      if (data.user && !data.user.phone_verified) {
        router.push("/verify-otp");
      } else {
        const dashboardPath = data.user?.role === "USER" ? "/dashboard" : "/mgmt/dashboard";
        router.push(dashboardPath);
      }
      onSuccess();
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed";
      
      toast.error("Login failed", {
        description: errorMessage || "Invalid email or password. Please try again.",
      });
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
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter email or phone number"
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
