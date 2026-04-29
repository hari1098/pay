"use client";

import React from "react";
import { Control, FieldPath } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageType } from "@/lib/enum/page-type";
import { PositionType } from "@/lib/enum/position-type";
import { AdType } from "@/lib/enum/ad-type";

interface AdPositionSelectorProps<T extends Record<string, any>> {
  control: Control<T>;
  adType: AdType;
  disabled?: boolean;
}

export function AdPositionSelector<T extends Record<string, any>>({
  control,
  adType,
  disabled = false
}: AdPositionSelectorProps<T>) {
  
  const getPositionTypeOptions = () => {
    switch (adType) {
      case AdType.LINE:
        return []; 
      case AdType.POSTER:
        return [
          { value: PositionType.LEFT_SIDE, label: "Left Side" },
          { value: PositionType.RIGHT_SIDE, label: "Right Side" },
          { value: PositionType.CENTER_TOP, label: "Center Top" },
          { value: PositionType.CENTER_BOTTOM, label: "Center Bottom" },
        ];
      case AdType.VIDEO:
        return [
          { value: PositionType.LEFT_SIDE, label: "Left Side" },
          { value: PositionType.RIGHT_SIDE, label: "Right Side" },
        ];
      default:
        return [];
    }
  };

  const requiresPositionNumber = (positionType?: PositionType) => {
    if (adType === AdType.LINE) return false;
    if (adType === AdType.VIDEO) return true; 
    if (adType === AdType.POSTER) {
      return positionType === PositionType.LEFT_SIDE || positionType === PositionType.RIGHT_SIDE;
    }
    return false;
  };

  const getPositionNumbers = () => {
    return Array.from({ length: 6 }, (_, i) => i + 1);
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-medium">Ad Position</h3>
      
      <FormField
        control={control}
        name={"pageType" as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Page Type *</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="w-full py-2">
                  <SelectValue placeholder="Select page type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={PageType.HOME}>Home Page</SelectItem>
                <SelectItem value={PageType.CATEGORY}>Category Page</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {adType !== AdType.LINE && (
        <FormField
          control={control}
          name={"side" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Position Type *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger className="w-full py-2">
                    <SelectValue placeholder="Select position type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getPositionTypeOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {adType !== AdType.LINE && (
        <FormField
          control={control}
          name={"position" as FieldPath<T>}
          render={({ field }) => {

            const formValues = control._formValues;
            const positionType = formValues?.side;
            const shouldShowPositionNumber = requiresPositionNumber(positionType);
            
            if (!shouldShowPositionNumber) {
              return <div className="hidden" />;
            }

            return (
              <FormItem>
                <FormLabel className="text-sm font-medium">Position Number *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full py-2">
                      <SelectValue placeholder="Select position number" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getPositionNumbers().map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Position {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      )}
    </div>
  );
}