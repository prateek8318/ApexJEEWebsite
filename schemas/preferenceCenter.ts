import { z } from "zod";
import { isAlphanumeric } from "validator";

export const PreferenceCenterSchema = z.object({
  brandLogo: z.array(z.instanceof(File)).max(1, { message: "Should contain max of 1 file!" }),

  headerText: z
    .string()
    .min(3, "Should contain min of 3 characters!")
    .max(100, "Should contain max of 100 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " -_&()" }),
      "Invalid characters found!",
    ),
  addTitle: z
    .string()
    .min(3, "Should contain min of 3 characters!")
    .max(100, "Should contain max of 100 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " -_&()" }),
      "Invalid characters found!",
    ),
  subtitle: z
    .string()
    .min(5, "Should contain min of 5 characters!")
    .max(200, "Should contain max of 200 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " -_&()!,.?" }),
      "Invalid characters found!",
    ),
  button1: z
    .string()
    .min(2, "Should contain min of 2 characters!")
    .max(30, "Should contain max of 30 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " " }),
      "Invalid characters found!",
    ),
  button2: z
    .string()
    .min(2, "Should contain min of 2 characters!")
    .max(30, "Should contain max of 30 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " " }),
      "Invalid characters found!",
    ),
});

export type PreferenceCenterValues = z.infer<typeof PreferenceCenterSchema>;

export const UserPreferenceSelectionSchema = z.object({
  selectedConsents: z
    .array(z.string())
    .min(1, "Please select at least one consent preference."),
});

export type UserPreferenceSelectionValues = z.infer<typeof UserPreferenceSelectionSchema>;
