"use client";
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Edit,
  Trash,
  MoreHorizontal,
  Power,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useMutation } from "@tanstack/react-query";
import {
  MainCategoryFormValues,
  CategoryFormDialog,
  SubCategoryFormValues,
} from "@/components/mgmt/categories/category-form-dialog";
import { DeleteCategoryDialog } from "@/components/mgmt/categories/delete-category-dialog";
import { MainCategory, SubCategory } from "@/lib/types/category";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["categoryTree"],
    queryFn: async () => {
      const { data } = await api.get("/categories/tree");
      return data;
    },
  });

  const [addMainDialogOpen, setAddMainDialogOpen] = useState(false);

  const createMainCategory = useMutation({
    mutationFn: async (data: MainCategoryFormValues) => {
      const response = await api.post("/categories/main", data);
      return response.data;
    },
    onSuccess: () => {
      setAddMainDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Main category created successfully");
    },
    onError: () => {
      toast.error("Failed to create main category");
    },
  });

  const handleAddMainCategory = (data: MainCategoryFormValues) => {
    createMainCategory.mutate(data);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage advertisement categories for the PaisaAds platform.
          </p>
        </div>
        <Button onClick={() => setAddMainDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Separator />

      <Card className="shadow-sm">
        <CardHeader className="pb-3 bg-muted/50">
          <CardTitle>Category Management</CardTitle>
          <CardDescription>
            View and manage all advertisement categories and their hierarchies.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">
                Error loading categories. Please try again.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : data?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No categories found. Create your first category to get started.
              </p>
              <Button
                className="mt-4"
                onClick={() => setAddMainDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          ) : (
            <div>
              {data?.map((category: MainCategory, index: number) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isLast={index === data.length - 1}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={addMainDialogOpen}
        onOpenChange={setAddMainDialogOpen}
        title="Add Main Category"
        level="main"
        onSubmit={handleAddMainCategory}
        isLoading={createMainCategory.isPending}
      />
    </div>
  );
}

function CategoryItem({
  category,
  isLast,
}: {
  category: MainCategory;
  isLast: boolean;
}) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(true);
  const hasSubCategories =
    category.subCategories && category.subCategories.length > 0;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addSubDialogOpen, setAddSubDialogOpen] = useState(false);

  const updateMainCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.patch(`/categories/main/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Category updated successfully");
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });

  const deleteMainCategory = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/categories/main/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Category deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });

  const createLevelOneCategory = useMutation({
    mutationFn: async ({ mainId, data }: { mainId: string; data: any }) => {
      const response = await api.post(`/categories/main/${mainId}/one`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Subcategory created successfully");
    },
    onError: () => {
      toast.error("Failed to create subcategory");
    },
  });

  const getCategoryColor = () => {
    return category.categories_color || "#6366f1";
  };

  const handleEditCategory = (data: MainCategoryFormValues) => {
    updateMainCategory.mutate(
      { id: category.id, data },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
        },
      }
    );
  };

  const handleDeleteCategory = () => {
    deleteMainCategory.mutate(category.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  const handleAddSubcategory = (data: SubCategoryFormValues) => {
    createLevelOneCategory.mutate(
      { mainId: category.id, data },
      {
        onSuccess: () => {
          setAddSubDialogOpen(false);
        },
      }
    );
  };

  return (
    <div className={`${!isLast ? "border-b" : ""}`}>
      <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors bg-white">
        <div className="flex items-center space-x-3 flex-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getCategoryColor() }}
          />
          <span className="font-medium">{category.name}</span>
          <Badge
            variant="outline"
            className={`${
              category.isActive ? "bg-green-600" : "bg-gray-400"
            } text-white border-0 text-xs`}
          >
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Created: {new Date(category.created_at).toLocaleDateString()}
          </div>

          {hasSubCategories && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-8 w-8"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddSubDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Subcategory
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  updateMainCategory.mutate({
                    id: category.id,
                    data: { isActive: !category.isActive },
                  });
                }}
              >
                <Power className="mr-2 h-4 w-4" />{" "}
                {category.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {hasSubCategories && expanded && (
        <div className="pl-6 border-l-2 border-l-muted ml-8 mb-2 bg-gray-50">
          <div className="text-sm font-medium text-muted-foreground px-4 py-2 border-b bg-muted/30">
            Subcategories ({category.subCategories.length})
          </div>
          <div>
            {category.subCategories.map(
              (subCategory: SubCategory, index: number) => (
                <SubCategoryItem
                  key={subCategory.id}
                  subCategory={subCategory}
                  isLast={index === category.subCategories.length - 1}
                  parentId={category.id}
                />
              )
            )}
          </div>
        </div>
      )}

      <CategoryFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Category"
        level="main"
        initialData={{
          name: category.name,
          category_heading_font_color:
            category.category_heading_font_color || "#000000",
          categories_color: category.categories_color || "#6366f1",
          font_color: category.font_color || "#000000",
          isActive: category.isActive,
        }}
        onSubmit={handleEditCategory}
        isLoading={updateMainCategory.isPending}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        categoryName={category.name}
        onDelete={handleDeleteCategory}
        isLoading={deleteMainCategory.isPending}
      />

      <CategoryFormDialog
        open={addSubDialogOpen}
        onOpenChange={setAddSubDialogOpen}
        title={`Add Subcategory to ${category.name}`}
        level="one"
        onSubmit={handleAddSubcategory}
        isLoading={createLevelOneCategory.isPending}
      />
    </div>
  );
}

function SubCategoryItem({
  subCategory,
  isLast,
  parentId,
}: {
  subCategory: SubCategory;
  isLast: boolean;
  parentId: string;
}) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(true);
  const hasSubCategories =
    subCategory.subCategories && subCategory.subCategories.length > 0;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addSubDialogOpen, setAddSubDialogOpen] = useState(false);

  const updateLevelOneCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.patch(`/categories/one/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Subcategory updated successfully");
    },
    onError: () => {
      toast.error("Failed to update subcategory");
    },
  });

  const deleteLevelOneCategory = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/categories/one/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Subcategory deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete subcategory");
    },
  });

  const createLevelTwoCategory = useMutation({
    mutationFn: async ({ oneId, data }: { oneId: string; data: any }) => {
      const response = await api.post(`/categories/one/${oneId}/two`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Subcategory created successfully");
    },
    onError: () => {
      toast.error("Failed to create subcategory");
    },
  });

  const handleEditCategory = (data: SubCategoryFormValues) => {
    updateLevelOneCategory.mutate(
      { id: subCategory.id, data },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
        },
      }
    );
  };

  const handleDeleteCategory = () => {
    deleteLevelOneCategory.mutate(subCategory.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  const handleAddSubcategory = (data: SubCategoryFormValues) => {
    createLevelTwoCategory.mutate(
      { oneId: subCategory.id, data },
      {
        onSuccess: () => {
          setAddSubDialogOpen(false);
        },
      }
    );
  };

  return (
    <div className={`${!isLast ? "border-b border-dashed" : ""}`}>
      <div className="flex items-center justify-between px-4 py-3 hover:bg-white transition-colors">
        <div className="flex items-center space-x-3 flex-1">
          <div
            className="w-2 h-2 rounded-full ring-1 ring-offset-1"
            style={{
              backgroundColor:
                subCategory.category_heading_font_color || "#ec4899",
            }}
          />
          <span className="text-sm font-medium">{subCategory.name}</span>
          <Badge
            variant="outline"
            className={`${
              subCategory.isActive ? "bg-green-600" : "bg-gray-400"
            } text-white border-0 text-xs`}
          >
            {subCategory.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {hasSubCategories && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-7 w-7"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-3 w-3" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddSubDialogOpen(true)}>
                <Plus className="mr-2 h-3 w-3" /> Add Subcategory
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  updateLevelOneCategory.mutate({
                    id: subCategory.id,
                    data: { isActive: !subCategory.isActive },
                  });
                }}
              >
                <Power className="mr-2 h-3 w-3" />{" "}
                {subCategory.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash className="mr-2 h-3 w-3" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {hasSubCategories && expanded && (
        <div className="pl-4 border-l-2 border-l-muted/70 ml-6 mb-1 bg-gray-100/70">
          {subCategory.subCategories?.map(
            (thirdLevelCategory: SubCategory, index: number) => (
              <ThirdLevelCategoryItem
                key={thirdLevelCategory.id}
                category={thirdLevelCategory}
                isLast={index === subCategory.subCategories!.length - 1}
                parentId={subCategory.id}
              />
            )
          )}
        </div>
      )}

      <CategoryFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Subcategory"
        level="one"
        initialData={{
          name: subCategory.name,
          category_heading_font_color:
            subCategory.category_heading_font_color || "#000000",
          isActive: subCategory.isActive,
        }}
        onSubmit={handleEditCategory}
        isLoading={updateLevelOneCategory.isPending}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        categoryName={subCategory.name}
        onDelete={handleDeleteCategory}
        isLoading={deleteLevelOneCategory.isPending}
      />

      <CategoryFormDialog
        open={addSubDialogOpen}
        onOpenChange={setAddSubDialogOpen}
        title={`Add Subcategory to ${subCategory.name}`}
        level="two"
        onSubmit={handleAddSubcategory}
        isLoading={createLevelTwoCategory.isPending}
      />
    </div>
  );
}

function ThirdLevelCategoryItem({
  category,
  isLast,
  parentId,
}: {
  category: any;
  isLast: boolean;
  parentId: string;
}) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(true);
  const hasSubCategories =
    category.subCategories && category.subCategories.length > 0;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addSubDialogOpen, setAddSubDialogOpen] = useState(false);

  const updateLevelTwoCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.patch(`/categories/two/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Subcategory updated successfully");
    },
    onError: () => {
      toast.error("Failed to update subcategory");
    },
  });

  const deleteLevelTwoCategory = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/categories/two/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Subcategory deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete subcategory");
    },
  });

  const createLevelThreeCategory = useMutation({
    mutationFn: async ({ twoId, data }: { twoId: string; data: any }) => {
      const response = await api.post(`/categories/two/${twoId}/three`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Subcategory created successfully");
    },
    onError: () => {
      toast.error("Failed to create subcategory");
    },
  });

  const handleEditCategory = (data: SubCategoryFormValues) => {
    updateLevelTwoCategory.mutate(
      { id: category.id, data },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
        },
      }
    );
  };

  const handleDeleteCategory = () => {
    deleteLevelTwoCategory.mutate(category.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  const handleAddSubcategory = (data: SubCategoryFormValues) => {
    createLevelThreeCategory.mutate(
      { twoId: category.id, data },
      {
        onSuccess: () => {
          setAddSubDialogOpen(false);
        },
      }
    );
  };

  return (
    <div className={`${!isLast ? "border-b border-dotted" : ""}`}>
      <div className="flex items-center justify-between px-4 py-2 hover:bg-white transition-colors">
        <div className="flex items-center space-x-3 flex-1">
          <div
            className="w-2 h-2 rounded-full ring-1 ring-offset-1 ring-muted"
            style={{
              backgroundColor:
                category.category_heading_font_color || "#f59e0b",
            }}
          />
          <span className="text-sm">{category.name}</span>
          <Badge
            variant="outline"
            className={`${
              category.isActive ? "bg-green-600" : "bg-gray-400"
            } text-white border-0 text-xs`}
          >
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {hasSubCategories && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-3 w-3" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddSubDialogOpen(true)}>
                <Plus className="mr-2 h-3 w-3" /> Add Subcategory
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  updateLevelTwoCategory.mutate({
                    id: category.id,
                    data: { isActive: !category.isActive },
                  });
                }}
              >
                <Power className="mr-2 h-3 w-3" />{" "}
                {category.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash className="mr-2 h-3 w-3" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {hasSubCategories && expanded && (
        <div className="pl-4 border-l-2 border-l-muted/50 ml-6 bg-gray-100/40">
          {category.subCategories.map(
            (fourthLevelCategory: SubCategory, index: number) => (
              <FourthLevelCategoryItem
                key={fourthLevelCategory.id}
                category={fourthLevelCategory}
                isLast={index === category.subCategories.length - 1}
                parentId={category.id}
              />
            )
          )}
        </div>
      )}

      <CategoryFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Subcategory"
        level="two"
        initialData={{
          name: category.name,
          category_heading_font_color:
            category.category_heading_font_color || "#000000",
          isActive: category.isActive,
        }}
        onSubmit={handleEditCategory}
        isLoading={updateLevelTwoCategory.isPending}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        categoryName={category.name}
        onDelete={handleDeleteCategory}
        isLoading={deleteLevelTwoCategory.isPending}
      />

      <CategoryFormDialog
        open={addSubDialogOpen}
        onOpenChange={setAddSubDialogOpen}
        title={`Add Subcategory to ${category.name}`}
        level="three"
        onSubmit={handleAddSubcategory}
        isLoading={createLevelThreeCategory.isPending}
      />
    </div>
  );
}

function FourthLevelCategoryItem({
  category,
  isLast,
  parentId,
}: {
  category: SubCategory;
  parentId: string;
  isLast: boolean;
}) {
  const queryClient = useQueryClient();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addSubDialogOpen, setAddSubDialogOpen] = useState(false);

  const updateLevelThreeCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.patch(`/categories/three/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Subcategory updated successfully");
    },
    onError: () => {
      toast.error("Failed to update subcategory");
    },
  });

  const deleteLevelThreeCategory = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/categories/three/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Subcategory deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete subcategory");
    },
  });

  const createLevelThreeCategory = useMutation({
    mutationFn: async ({
      twoId,
      data,
    }: {
      twoId: string;
      data: SubCategoryFormValues;
    }) => {
      return api.post(`/categories/level-two/${twoId}/subcategories`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      toast.success("Subcategory created successfully");
    },
    onError: () => {
      toast.error("Failed to create subcategory");
    },
  });

  const handleEditCategory = (data: SubCategoryFormValues) => {
    updateLevelThreeCategory.mutate(
      { id: category.id, data },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
        },
      }
    );
  };

  const handleDeleteCategory = () => {
    deleteLevelThreeCategory.mutate(category.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  const handleAddSubcategory = (data: SubCategoryFormValues) => {
    createLevelThreeCategory.mutate(
      { twoId: category.id, data },
      {
        onSuccess: () => {
          setAddSubDialogOpen(false);
        },
      }
    );
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 hover:bg-white transition-colors ${
        !isLast ? "border-b border-dotted border-muted/30" : ""
      }`}
    >
      <div className="flex items-center space-x-3 flex-1">
        <div
          className="w-1.5 h-1.5 rounded-full ring-1 ring-offset-1 ring-muted/50"
          style={{
            backgroundColor: category.category_heading_font_color || "#10b981",
          }}
        />
        <span className="text-xs">{category.name}</span>
        <Badge
          variant="outline"
          className={`${
            category.isActive ? "bg-green-600" : "bg-gray-400"
          } text-white border-0 text-xs`}
        >
          {category.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-3 w-3" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              updateLevelThreeCategory.mutate({
                id: category.id,
                data: { isActive: !category.isActive },
              });
            }}
          >
            <Power className="mr-2 h-3 w-3" />{" "}
            {category.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="mr-2 h-3 w-3" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CategoryFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Subcategory"
        level="three"
        initialData={{
          name: category.name,
          category_heading_font_color:
            category.category_heading_font_color || "#000000",
          isActive: category.isActive,
        }}
        onSubmit={handleEditCategory}
        isLoading={updateLevelThreeCategory.isPending}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        categoryName={category.name}
        onDelete={handleDeleteCategory}
        isLoading={deleteLevelThreeCategory.isPending}
      />
    </div>
  );
}
