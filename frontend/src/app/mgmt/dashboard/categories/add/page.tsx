"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { CategoryColorPicker } from "@/components/mgmt/categories/category-color-picket";
import { CategoryTreeForm } from "@/components/mgmt/categories/category-tree-form";

const levelThreeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_heading_font_color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Valid color code is required"
    ),
  subCategories: z.array(z.never()).length(0, "Level 3 categories cannot have subcategories"),
});

const levelTwoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_heading_font_color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Valid color code is required"
    ),
  subCategories: z.array(levelThreeSchema),
});

const levelOneSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_heading_font_color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Valid color code is required"
    ),
  subCategories: z.array(levelTwoSchema),
});

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_heading_font_color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Valid color code is required"
    ),
  categories_color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Valid color code is required"
    ),
  font_color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Valid color code is required"
    ),
  subCategories: z.array(levelOneSchema),
});

export type CategoryFormValues = z.infer<typeof formSchema>;

export default function AddCategoryPage() {
  const router = useRouter();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category_heading_font_color: "#000000",
      categories_color: "#f0f0f0",
      font_color: "#333333",
      subCategories: [],
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const response = await api.post("/categories/tree", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Category tree created successfully");
      router.push("/mgmt/dashboard/categories/view");
    },
    onError: (error: any) => {
      toast.error("Failed to create category", {
        description: error.response?.data?.message || "Please try again",
      });
    },
  });

  function onSubmit(values: CategoryFormValues) {
    createCategoryMutation.mutate(values);
  }

  console.log(form.formState.errors)

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Category </h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Categories
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Main Category Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Automobiles" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_heading_font_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heading Font Color</FormLabel>
                      <FormControl>
                        <CategoryColorPicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categories_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <FormControl>
                        <CategoryColorPicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="font_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font Color</FormLabel>
                      <FormControl>
                        <CategoryColorPicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <Separator className="my-4" />

            <CardContent>
              <CategoryTreeForm form={form} />
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={createCategoryMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createCategoryMutation.isPending}>
                {createCategoryMutation.isPending
                  ? "Creating..."
                  : "Create Category Tree"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
