"use client";

import type React from "react";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const presetColors = [
  { value: "#000000", label: "Black" },
  { value: "#ffffff", label: "White" },
  { value: "#f43f5e", label: "Red" },
  { value: "#ec4899", label: "Pink" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#10b981", label: "Green" },
  { value: "#f59e0b", label: "Yellow" },
  { value: "#78716c", label: "Gray" },
];

interface CategoryColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryColorPicker({
  value,
  onChange,
}: CategoryColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [customColor, setCustomColor] = useState("");

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);

    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor)) {
      onChange(newColor);
    }
  };

  const handleCustomColorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(customColor)) {
      onChange(customColor);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded border border-gray-200"
              style={{ backgroundColor: value }}
            />
            <span>{value}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search color..." />
          <CommandList>
            <CommandEmpty>No color found.</CommandEmpty>
            <CommandGroup heading="Preset Colors">
              {presetColors.map((color) => (
                <CommandItem
                  key={color.value}
                  value={color.value}
                  onSelect={() => {
                    onChange(color.value);
                    setCustomColor(color.value);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded border border-gray-200"
                      style={{ backgroundColor: color.value }}
                    />
                    <span>{color.label}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === color.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Custom Color">
              <div className="p-2">
                <form onSubmit={handleCustomColorSubmit} className="flex gap-2">
                  <Input
                    value={customColor}
                    onChange={handleCustomColorChange}
                    placeholder="#RRGGBB"
                    className="h-8"
                  />
                  <Button type="submit" size="sm" className="h-8">
                    Apply
                  </Button>
                </form>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
