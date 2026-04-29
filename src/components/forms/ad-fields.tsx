import { PageType } from "@/lib/enum/page-type";
import { PositionType } from "@/lib/enum/position-type";
import { z } from "zod";

const baseFields = {
  mainCategoryId: z.string().min(1, { message: "Main category is required" }),
  categoryOneId: z.string().optional(),
  categoryTwoId: z.string().optional(),
  categoryThreeId: z.string().optional(),
  state: z.string().min(1, { message: "State is required" }),
  sid: z.number().optional(),
  city: z.string().min(1, { message: "City is required" }),
  cid: z.number().optional(),
  postedBy: z.string().min(1, { message: "Posted by is required" }),
  dates: z.array(z.date()).min(1, "At least one date is required"),
  pageType: z.nativeEnum(PageType),
  contactOne: z.coerce
    .number()
    .refine((n) => String(n).replace(/\D/g, "").length >= 10, {
      message: "Phone number must be at least 10 digits",
    }),
  contactTwo: z.coerce.number().optional(),
};

const lineAd = z.object({
  adType: z.literal("LINE"),
  ...baseFields,
  content: z.string().min(1, { message: "Ad content is required" }),
  imageIds: z.array(z.string()).max(3, { message: "Maximum 3 images allowed" }),
});

const posterAd = z.object({
  adType: z.literal("POSTER"),
  ...baseFields,
  imageId: z.string().min(1, { message: "Image is required" }),
  side: z.nativeEnum(PositionType),
  position: z.number().int().min(1).max(6).optional(), 
});

const videoAd = z.object({
  adType: z.literal("VIDEO"),
  ...baseFields,
  imageId: z.string().min(1, { message: "Video is required" }),
  side: z.nativeEnum(PositionType), 
  position: z.number().int().min(1).max(6), 
});

const adFormUnion = z.discriminatedUnion("adType", [lineAd, posterAd, videoAd]);

export const adFormSchema = adFormUnion.superRefine((data, ctx) => {
  if (data.adType === "POSTER") {
    const isSide =
      data.side === PositionType.LEFT_SIDE ||
      data.side === PositionType.RIGHT_SIDE;
    const isCenter =
      data.side === PositionType.CENTER_TOP ||
      data.side === PositionType.CENTER_BOTTOM;

    if (isSide && data.position === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["position"],
        message: "Position number is required for side positions",
      });
    }
    if (isCenter && data.position !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["position"],
        message: "Position number is not allowed for center positions",
      });
    }
  }

  if (data.adType === "VIDEO") {
    const isCenter =
      data.side === PositionType.CENTER_TOP ||
      data.side === PositionType.CENTER_BOTTOM;
    if (isCenter) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["side"],
        message: "Video ads cannot use CENTER_TOP or CENTER_BOTTOM positions",
      });
    }
  }
});

export type AdFormValues = z.infer<typeof adFormSchema>;
