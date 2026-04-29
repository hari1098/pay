import * as z from "zod";
import { AdType } from "./enum/ad-type";
import { PageType } from "./enum/page-type";
import { PositionType } from "./enum/position-type";

export const viewAdFormSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number must not exceed 15 digits" }),
});

export const loginFormSchema = z.object({
  emailOrPhone: z.string()
    .min(1, { message: "Email or phone number is required" })
    .refine((value) => {

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const phoneRegex = /^[6-9]\d{9}$/;

      const cleanPhone = value.replace(/\D/g, "");
      
      return emailRegex.test(value) || phoneRegex.test(cleanPhone);
    }, {
      message: "Please enter a valid email address or 10-digit phone number"
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const registerFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone_number: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" })
      .max(15, { message: "Phone number must not exceed 15 digits" }),
    secondary_number: z
      .string()
      .min(10, { message: "Secondary number must be at least 10 digits" })
      .max(15, { message: "Secondary number must not exceed 15 digits" })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirm_password: z
      .string()
      .min(1, { message: "Please confirm your password" }),
    country: z.string().min(1, { message: "Country is required" }),
    country_id: z.coerce.number().min(1, { message: "Country is required" }),
    state: z.string().min(1, { message: "State is required" }),
    state_id: z.coerce.number().min(1, { message: "State is required" }),
    city: z.string().min(1, { message: "City is required" }),
    city_id: z.coerce.number().min(1, { message: "City is required" }),
    proof: z.string().optional(),
    gender: z.coerce.number({
      message: "Please select a valid gender",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ViewAdFormValues = z.infer<typeof viewAdFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const lineAdFormSchema = z.object({
  mainCategoryId: z.string().min(1, { message: "Main category is required" }),
  categoryOneId: z.string().optional(),
  categoryTwoId: z.string().optional(),
  categoryThreeId: z.string().optional(),
  content: z.string().min(1, { message: "Ad content is required" }),
  imageIds: z.array(z.string()).max(3, { message: "Maximum 3 images allowed" }),
  state: z.string().min(1, { message: "State is required" }),
  sid: z.number().optional(),
  city: z.string().min(1, { message: "City is required" }),
  cid: z.number().optional(),
  dates: z.array(z.date()).min(1, "At least one date is required"),
  postedBy: z.string().min(1, { message: "Posted by is required" }),
  contactOne: z.coerce
    .number()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  contactTwo: z.coerce.number().optional(),

  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
});

export type LineAdFormValues = z.infer<typeof lineAdFormSchema>;

export const posterAdFormSchema = z
  .object({
    mainCategoryId: z.string().min(1, { message: "Main category is required" }),
    categoryOneId: z.string().optional(),
    categoryTwoId: z.string().optional(),
    categoryThreeId: z.string().optional(),
    imageId: z.string().min(1, { message: "Image is required" }),
    state: z.string().min(1, { message: "State is required" }),
    sid: z.number().optional(),
    city: z.string().min(1, { message: "City is required" }),
    cid: z.number().optional(),
    postedBy: z.string().min(1, { message: "Posted by is required" }),
    dates: z.array(z.date()).min(1, "At least one date is required"),

    pageType: z.nativeEnum(PageType),
    side: z.nativeEnum(PositionType),
    position: z.number().min(1).max(6).optional(), 
  })
  .refine(
    (data) => {

      if (
        data.side === PositionType.LEFT_SIDE ||
        data.side === PositionType.RIGHT_SIDE
      ) {
        return data.position !== undefined;
      }
      return true; 
    },
    {
      message: "Position number is required for side positions",
      path: ["position"],
    }
  );

export type PosterAdFormValues = z.infer<typeof posterAdFormSchema>;

export const videoAdFormSchema = z
  .object({
    mainCategoryId: z.string().min(1, { message: "Main category is required" }),
    categoryOneId: z.string().optional(),
    categoryTwoId: z.string().optional(),
    categoryThreeId: z.string().optional(),
    imageId: z.string().min(1, { message: "Video is required" }),
    state: z.string().min(1, { message: "State is required" }),
    sid: z.number().optional(),
    city: z.string().min(1, { message: "City is required" }),
    cid: z.number().optional(),
    postedBy: z.string().min(1, { message: "Posted by is required" }),
    dates: z.array(z.date()).min(1, "At least one date is required"),

    pageType: z.nativeEnum(PageType),
    side: z.nativeEnum(PositionType),
    position: z.number().min(1).max(8).optional(), 
  })
  .refine(
    (data) => {

      if (data.side === PositionType.LEFT_SIDE || data.side === PositionType.RIGHT_SIDE) {
        return data.position !== undefined && data.position >= 1 && data.position <= 8;
      }

      return true;
    },
    {
      message: "Position number is required for left and right side placements",
      path: ["position"],
    }
  );

export type VideoAdFormValues = z.infer<typeof videoAdFormSchema>;

export const sendVerificationOtpSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
});

export const verifyAccountSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export type SendVerificationOtpValues = z.infer<typeof sendVerificationOtpSchema>;
export type VerifyAccountValues = z.infer<typeof verifyAccountSchema>;

export const sendLoginOtpSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
});

export const verifyLoginOtpSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export type SendLoginOtpValues = z.infer<typeof sendLoginOtpSchema>;
export type VerifyLoginOtpValues = z.infer<typeof verifyLoginOtpSchema>;

