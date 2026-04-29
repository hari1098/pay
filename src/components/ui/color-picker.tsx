"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const COLOR_COMBINATIONS = [
  {
    id: "default",
    name: "Default (White & Black)",
    backgroundColor: "#ffffff",
    textColor: "#000000",
  },
  {
    id: "blue-theme",
    name: "Professional Blue",
    backgroundColor: "#1e40af",
    textColor: "#ffffff",
  },
  {
    id: "green-theme", 
    name: "Fresh Green",
    backgroundColor: "#16a34a",
    textColor: "#ffffff",
  },
  {
    id: "red-theme",
    name: "Bold Red",
    backgroundColor: "#dc2626",
    textColor: "#ffffff",
  },
  {
    id: "purple-theme",
    name: "Royal Purple",
    backgroundColor: "#7c3aed",
    textColor: "#ffffff",
  },
] as const;

interface ColorPickerProps {
  selectedBackgroundColor?: string;
  selectedTextColor?: string;
  onChange: (backgroundColor: string, textColor: string) => void;
  className?: string;
}

export function ColorPicker({
  selectedBackgroundColor = "#ffffff",
  selectedTextColor = "#000000",
  onChange,
  className,
}: ColorPickerProps) {

  const selectedCombination = COLOR_COMBINATIONS.find(
    combo => combo.backgroundColor === selectedBackgroundColor && 
             combo.textColor === selectedTextColor
  )?.id || COLOR_COMBINATIONS[0].id;

  const handleColorChange = (combinationId: string) => {
    const combination = COLOR_COMBINATIONS.find(combo => combo.id === combinationId);
    if (combination) {
      onChange(combination.backgroundColor, combination.textColor);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">Line Ad Color Theme</Label>
      <Select value={selectedCombination} onValueChange={handleColorChange}>
        <SelectTrigger className="w-full max-w-xs">
          <SelectValue placeholder="Select a color theme" />
        </SelectTrigger>
        <SelectContent>
          {COLOR_COMBINATIONS.map((combination) => (
            <SelectItem key={combination.id} value={combination.id}>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: combination.backgroundColor }}
                  />
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: combination.textColor }}
                  />
                </div>
                <span>{combination.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}