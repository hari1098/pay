"use client";

import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
  dependencies: any[] = []
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(callback);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay, ...dependencies]);

  return debouncedCallback;
}

export function useDebouncedForm<T>(
  initialValue: T,
  onDebouncedChange?: (value: T) => void,
  delay: number = 300
) {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebouncedValue(value, delay);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    if (value !== debouncedValue) {
      setIsDebouncing(true);
    } else {
      setIsDebouncing(false);
    }
  }, [value, debouncedValue]);

  useEffect(() => {
    if (onDebouncedChange && debouncedValue !== initialValue) {
      onDebouncedChange(debouncedValue);
    }
  }, [debouncedValue, onDebouncedChange, initialValue]);

  return {
    value,
    debouncedValue,
    setValue,
    isDebouncing,
  };
}