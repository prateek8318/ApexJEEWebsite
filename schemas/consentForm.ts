import { z } from "zod";
import { isAlpha, isAlphanumeric } from "validator";

const PurposeItemSchema = z.object({
  purpose: z
    .string()
    .max(200, "Should contain max of 200 characters!")
    .optional()
    .or(z.literal("")),
  dataCategories: z
    .string()
    .max(200, "Should contain max of 200 characters!")
    .optional()
    .or(z.literal("")),
});
export type ConsentStatus = "ACTIVE" | "DRAFT" | "INACTIVE";
export type ConsentCategory = "Privacy" | "Marketing" | "Compliance" | "Legal";

export type ConsentFormType = {
  id: string;
  uuid: string;
  title: string;
  category: ConsentCategory;
  version: string;
  status: ConsentStatus;
  createdDate: string;
};

export type ConsentPurposeType = {
  id: string;
  purpose: string;
  categories: string[];
};

export const ConsentFormSchema = z.object({
  language: z
    .string()
    .min(2, "Should contain min of 2 characters!")
    .max(30, "Should contain max of 30 characters!")
    .refine(
      (data) => isAlpha(data, "en-US", { ignore: " " }),
      "Invalid characters found!",
    ),
  headerText: z
    .string()
    .min(3, "Should contain min of 3 characters!")
    .max(100, "Should contain max of 100 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " -_&()" }),
      "Invalid characters found!",
    ),
  bodyText: z
    .string()
    .min(10, "Should contain min of 10 characters!")
    .max(1000, "Should contain max of 1000 characters!"),
  noticeLink: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.string().length(0)),
  footerText: z
    .string()
    .max(200, "Should contain max of 200 characters!")
    .optional(),
  consentTime: z
    .string()
    .max(50, "Should contain max of 50 characters!")
    .optional(),
  purposes: z.array(PurposeItemSchema).optional(),
  brandLogo: z.array(z.instanceof(File)).max(1, { message: "Should contain max of 1 file!" }),
  banner: z.array(z.instanceof(File)).max(1, { message: "Should contain max of 1 file!" }),
  ctaColor: z
    .string()
    .min(4, "Invalid hex color format")
    .max(7, "Invalid hex color format")
    .refine(
      (val) => val.startsWith("#") && (val.length === 4 || val.length === 7),
      {
        message: "Invalid hex color format (e.g., #000 or #000000)",
      },
    ),
  
});

export type ConsentFormValues = z.infer<typeof ConsentFormSchema>;
export type PurposeItemValues = z.infer<typeof PurposeItemSchema>;
