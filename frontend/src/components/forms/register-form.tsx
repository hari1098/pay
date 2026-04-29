"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { registerFormSchema, type RegisterFormValues } from "@/lib/validations";
import { ImageUpload } from "@/components/image-upload";
import api from "@/lib/api";

export default function RegisterForm() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      secondary_number: "",
      password: "",
      confirm_password: "",
      country: "",
      state: "",
      city: "",
      proof: "",
      gender: 0,
    },
  });

  const handleCountryChange = (country: any) => {
    console.log(country);
    if (country) {
      setSelectedCountry(country);
      form.setValue("country", country.name);
      form.setValue("country_id", country.id);

      setSelectedState(null);
      setSelectedCity(null);
      form.setValue("state", "");

      form.setValue("state_id", 0);
      form.setValue("city", "");

      form.setValue("city_id", 0);
    }
  };

  const handleStateChange = (state: any) => {
    if (state) {
      setSelectedState(state);
      form.setValue("state", state.name);
      form.setValue("state_id", state.id);

      setSelectedCity(null);
      form.setValue("city", "");

      form.setValue("city_id", 0);
    }
  };

  const handleCityChange = (city: any) => {
    if (city) {
      setSelectedCity(city);
      form.setValue("city", city.name);
      form.setValue("city_id", city.id);
    }
  };

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {

      form.setValue("proof", data.id);
      toast.success("Proof document uploaded successfully");
    },
    onError: (error) => {
      console.error("Image upload error:", error);
      toast.error("Failed to upload proof document", {
        description: "Please try again with a different file",
      });

      form.setValue("proof", "");
    },
  });

  const handleImageSelect = (file: File) => {
    if (file) {
      uploadImageMutation.mutate(file);
    }
  };
  console.log(form.getValues);

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {

      const { confirm_password, ...registrationData } = data;
      const response = await api.post("/users/register-customer", registrationData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Account created successfully", {
        description: "Please login to verify your phone number and access your account",
      });

      router.push(`/`);
    },
    onError: (error) => {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        description: "Phone number or email address already in use.",
      });
    },
  });

  function onSubmit(data: RegisterFormValues) {
    registerMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Phone number" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondary_number"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Secondary Phone number" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-xs">
                    This number will be used for ads if provided.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Confirm Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="0" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Male
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Female
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="country_id"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="country-select-container">
                      <CountrySelect
                        onChange={handleCountryChange}
                        placeHolder="Select Country"
                        containerClassName="country-select"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state_id"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="state-select-container">
                      <StateSelect
                        countryid={selectedCountry?.id}
                        onChange={handleStateChange}
                        placeHolder="Select State"
                        containerClassName="state-select"
                        disabled={!selectedCountry}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city_id"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="city-select-container">
                      <CitySelect
                        countryid={selectedCountry?.id}
                        stateid={selectedState?.id}
                        onChange={handleCityChange}
                        placeHolder="Select City"
                        containerClassName="city-select"
                        disabled={!selectedState}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proof"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    ID proof (Aadhar card, Drivers license, voter id, etc.)
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      isUploading={uploadImageMutation.isPending}
                      imageId={field.value}
                      uploadError={uploadImageMutation.isError}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending || uploadImageMutation.isPending}
        >
          {registerMutation.isPending
            ? "Creating Account..."
            : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
