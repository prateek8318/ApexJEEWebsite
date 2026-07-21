import { z } from "zod";
import { isAlpha, isAlphanumeric } from "validator";

export const RevokeFormSchema = z.object({
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
  purposes: z
    .array(
      z.object({
        purpose: z
          .string()
          .max(200, "Should contain max of 200 characters!")
          .optional()
          .or(z.literal("")),
      }),
    )
    .optional(),
  title: z
    .string()
    .max(100, "Should contain max of 100 characters!")
    .optional(),
  consentText: z
    .string()
    .max(500, "Should contain max of 500 characters!")
    .optional(),
  brandLogo: z.array(z.instanceof(File)).max(1, { message: "Should contain max of 1 file!" }),
  banner: z.array(z.instanceof(File)).max(1, { message: "Should contain max of 1 file!" }),
  ctaColor: z
    .string()
    .min(4, "Invalid hex color format")
    .max(7, "Invalid hex color format")
    .refine(
      (val) => val.startsWith("#") && (val.length === 4 || val.length === 7),
      { message: "Invalid hex color format (e.g., #000 or #000000)" },
    ),
});

export type RevokeFormValues = z.infer<typeof RevokeFormSchema>;
