import { z } from "zod";
import { isAlpha, isAlphanumeric, isEmail, isEmpty } from "validator";

export const BasicInformationSchema = z.object({
  templateName: z
    .string()
    .min(3, "Should contain min of 3 characters!")
    .max(50, "Should contain max of 50 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " -_" }),
      "Invalid characters found!",
    ),

  version: z.string().min(1, "Version is required").optional(),

  description: z
    .string()
    .min(10, "Should contain min of 10 characters!")
    .max(200, "Should contain max of 200 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " ,.-_()/@" }),
      "Invalid characters found!",
    ),

  status: z
    .string()
    .max(20, "Should contain max of 20 characters!")
    .optional()
    .refine(
      (data) =>
        isAlpha(data ? data : "", "en-US", { ignore: " " }) ||
        isEmpty(data ? data : ""),
      "Invalid characters found!",
    ),

  legalEntity: z
    .string()
    .min(2, "Should contain min of 2 characters!")
    .max(50, "Should contain max of 50 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " &-" }),
      "Invalid characters found!",
    ),

  department: z
    .string()
    .max(50, "Should contain max of 50 characters!")
    .optional()
    .refine(
      (data) =>
        isAlpha(data ? data : "", "en-US", { ignore: " &-" }) ||
        isEmpty(data ? data : ""),
      "Invalid characters found!",
    ),

  businessUnit: z
    .string()
    .max(50, "Should contain max of 50 characters!")
    .optional()
    .refine(
      (data) =>
        isAlphanumeric(data ? data : "", "en-US", { ignore: " &-" }) ||
        isEmpty(data ? data : ""),
      "Invalid characters found!",
    ),

  vendorProcessor: z
    .string()
    .max(50, "Should contain max of 50 characters!")
    .optional()
    .refine(
      (data) =>
        isAlphanumeric(data ? data : "", "en-US", { ignore: " &-" }) ||
        isEmpty(data ? data : ""),
      "Invalid characters found!",
    ),

  owner: z
    .string()
    .min(3, "Should contain min of 3 characters!")
    .max(50, "Should contain max of 50 characters!")
    .refine(
      (data) => isAlpha(data, "en-US", { ignore: " " }),
      "Invalid characters found!",
    ),

  dpo: z
    .string()
    .max(50, "Should contain max of 50 characters!")
    .optional()
    .refine(
      (data) =>
        isAlpha(data ? data : "", "en-US", { ignore: " " }) ||
        isEmpty(data ? data : ""),
      "Invalid characters found!",
    ),

  contactEmail: z.string().refine((data) => isEmail(data), "Invalid email!"),
});
