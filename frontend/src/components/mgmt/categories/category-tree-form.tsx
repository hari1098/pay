"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CategoryColorPicker } from "./category-color-picket";
import { CategoryFormValues } from "@/app/mgmt/dashboard/categories/add/page";

interface CategoryTreeFormProps {
  form: UseFormReturn<CategoryFormValues>;
}

export function CategoryTreeForm({ form }: CategoryTreeFormProps) {
  const {
    fields: levelOneFields,
    append: appendLevelOne,
    remove: removeLevelOne,
  } = useFieldArray({
    control: form.control,
    name: "subCategories",
  });

  return (
    <div className="space-y-6 pb-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Subcategories</h3>
        <div className="flex flex-col items-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendLevelOne({
                name: "",
                category_heading_font_color: "#000000",
                subCategories: [],
              })
            }
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Level 1 Category
          </Button>
        </div>
      </div>

      {levelOneFields.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No subcategories added yet. Click the button above to add one.
        </div>
      )}

      <Accordion type="multiple" className="space-y-4">
        {levelOneFields.map((field, levelOneIndex) => (
          <LevelOneCategory
            key={field.id}
            form={form}
            levelOneIndex={levelOneIndex}
            onRemove={() => removeLevelOne(levelOneIndex)}
          />
        ))}
      </Accordion>
    </div>
  );
}

interface LevelOneCategoryProps {
  form: UseFormReturn<CategoryFormValues>;
  levelOneIndex: number;
  onRemove: () => void;
}

function LevelOneCategory({
  form,
  levelOneIndex,
  onRemove,
}: LevelOneCategoryProps) {
  const {
    fields: levelTwoFields,
    append: appendLevelTwo,
    remove: removeLevelTwo,
  } = useFieldArray({
    control: form.control,
    name: `subCategories.${levelOneIndex}.subCategories`,
  });

  return (
    <AccordionItem
      value={`level-one-${levelOneIndex}`}
      className="border rounded-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Level 1</Badge>
          <AccordionTrigger className="hover:no-underline">
            <span className="text-base font-medium">
              {form.watch(`subCategories.${levelOneIndex}.name`) ||
                `Subcategory ${levelOneIndex + 1}`}
            </span>
          </AccordionTrigger>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AccordionContent className="px-4 pt-4 pb-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`subCategories.${levelOneIndex}.name`}
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
            name={`subCategories.${levelOneIndex}.category_heading_font_color`}
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Level 2 Subcategories</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendLevelTwo({
                  name: "",
                  category_heading_font_color: "#000000",
                  subCategories: [],
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Level 2 Category
            </Button>
          </div>

          {levelTwoFields.length === 0 && (
            <div className="text-center py-2 text-sm text-muted-foreground">
              No level 2 subcategories added yet.
            </div>
          )}

          <Accordion type="multiple" className="space-y-4">
            {levelTwoFields.map((field, levelTwoIndex) => (
              <LevelTwoCategory
                key={field.id}
                form={form}
                levelOneIndex={levelOneIndex}
                levelTwoIndex={levelTwoIndex}
                onRemove={() => removeLevelTwo(levelTwoIndex)}
              />
            ))}
          </Accordion>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

interface LevelTwoCategoryProps {
  form: UseFormReturn<CategoryFormValues>;
  levelOneIndex: number;
  levelTwoIndex: number;
  onRemove: () => void;
}

function LevelTwoCategory({
  form,
  levelOneIndex,
  levelTwoIndex,
  onRemove,
}: LevelTwoCategoryProps) {
  const {
    fields: levelThreeFields,
    append: appendLevelThree,
    remove: removeLevelThree,
  } = useFieldArray({
    control: form.control,
    name: `subCategories.${levelOneIndex}.subCategories.${levelTwoIndex}.subCategories`,
  });

  return (
    <AccordionItem
      value={`level-two-${levelOneIndex}-${levelTwoIndex}`}
      className="border rounded-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Level 2</Badge>
          <AccordionTrigger className="hover:no-underline">
            <span className="text-sm font-medium">
              {form.watch(
                `subCategories.${levelOneIndex}.subCategories.${levelTwoIndex}.name`
              ) || `Subcategory ${levelTwoIndex + 1}`}
            </span>
          </AccordionTrigger>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AccordionContent className="px-3 pt-3 pb-3 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`subCategories.${levelOneIndex}.subCategories.${levelTwoIndex}.name`}
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
            name={`subCategories.${levelOneIndex}.subCategories.${levelTwoIndex}.category_heading_font_color`}
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
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Level 3 Subcategories</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendLevelThree({
                  name: "",
                  category_heading_font_color: "#000000",
                  subCategories: [], 
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Level 3 Category
            </Button>
          </div>

          {levelThreeFields.length === 0 && (
            <div className="text-center py-2 text-xs text-muted-foreground">
              No level 3 subcategories added yet.
            </div>
          )}

          <div className="space-y-3">
            {levelThreeFields.map((field, levelThreeIndex) => (
              <LevelThreeCategory
                key={field.id}
                form={form}
                levelOneIndex={levelOneIndex}
                levelTwoIndex={levelTwoIndex}
                levelThreeIndex={levelThreeIndex}
                onRemove={() => removeLevelThree(levelThreeIndex)}
              />
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

interface LevelThreeCategoryProps {
  form: UseFormReturn<CategoryFormValues>;
  levelOneIndex: number;
  levelTwoIndex: number;
  levelThreeIndex: number;
  onRemove: () => void;
}

function LevelThreeCategory({
  form,
  levelOneIndex,
  levelTwoIndex,
  levelThreeIndex,
  onRemove,
}: LevelThreeCategoryProps) {
  return (
    <div className="border rounded-md space-y-3">
      <div className="flex items-center justify-between p-3 pb-0">
        <div className="flex items-center gap-2">
          <Badge>Level 3</Badge>
          <span className="text-sm font-medium">
            {form.watch(
              `subCategories.${levelOneIndex}.subCategories.${levelTwoIndex}.subCategories.${levelThreeIndex}.name`
            ) || `Subcategory ${levelThreeIndex + 1}`}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3 pb-3">
        <FormField
          control={form.control}
          name={`subCategories.${levelOneIndex}.subCategories.${levelTwoIndex}.subCategories.${levelThreeIndex}.name`}
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
          name={`subCategories.${levelOneIndex}.subCategories.${levelTwoIndex}.subCategories.${levelThreeIndex}.category_heading_font_color`}
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
      </div>
    </div>
  );
}
