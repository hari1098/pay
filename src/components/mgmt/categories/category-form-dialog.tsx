"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { CategoryColorPicker } from "./category-color-picket";

const mainCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_heading_font_color: z.string().optional(),
  categories_color: z.string().optional(),
  font_color: z.string().optional(),
  isActive: z.boolean(),
});

const subCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_heading_font_color: z.string().optional(),
  isActive: z.boolean(),
});

export type MainCategoryFormValues = z.infer<typeof mainCategorySchema>;
export type SubCategoryFormValues = z.infer<typeof subCategorySchema>;

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  level: "main" | "one" | "two" | "three";
  initialData?: MainCategoryFormValues | SubCategoryFormValues;
  onSubmit: (data: MainCategoryFormValues | SubCategoryFormValues) => void;
  isLoading: boolean;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  title,
  level,
  initialData,
  onSubmit,
  isLoading,
}: CategoryFormDialogProps) {
  const isMainCategory = level === "main";
  const schema = isMainCategory ? mainCategorySchema : subCategorySchema;

  const form = useForm<MainCategoryFormValues | SubCategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      name: "",
      category_heading_font_color: "#000000",
      ...(isMainCategory && {
        categories_color: "#6366f1",
        font_color: "#000000",
      }),
      isActive: true,
    },
  });

  const handleSubmit = (
    data: MainCategoryFormValues | SubCategoryFormValues
  ) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                      value={field.value || "#000000"}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isMainCategory && (
              <>
                <FormField
                  control={form.control}
                  name="categories_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Color</FormLabel>
                      <FormControl>
                        <CategoryColorPicker
                          value={field.value || "#6366f1"}
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
                          value={field.value || "#000000"}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
