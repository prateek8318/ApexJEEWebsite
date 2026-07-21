import { z } from "zod";
import { isAlpha, isAlphanumeric } from "validator";

export const LanguageSchema = z.object({
  templateName: z
    .string()
    .min(3, "Should contain min of 3 characters!")
    .max(50, "Should contain max of 50 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " -_" }),
      "Invalid characters found!",
    ),
  language: z
    .string()
    .min(2, "Should contain min of 2 characters!")
    .max(30, "Should contain max of 30 characters!")
    .refine(
      (data) => isAlpha(data, "en-US", { ignore: " " }),
      "Invalid characters found!",
    ),
  categories: z.object({
    treatment: z
      .string()
      .min(3, "Should contain min of 3 characters!")
      .max(50, "Should contain max of 50 characters!")
      .refine(
        (data) => isAlpha(data, "en-US", { ignore: " " }),
        "Invalid characters found!",
      ),
    marketing: z
      .string()
      .min(3, "Should contain min of 3 characters!")
      .max(50, "Should contain max of 50 characters!")
      .refine(
        (data) => isAlpha(data, "en-US", { ignore: " " }),
        "Invalid characters found!",
      ),
    support: z
      .string()
      .min(3, "Should contain min of 3 characters!")
      .max(50, "Should contain max of 50 characters!")
      .refine(
        (data) => isAlpha(data, "en-US", { ignore: " " }),
        "Invalid characters found!",
      ),
  }),
});

export type LanguageValues = z.infer<typeof LanguageSchema>;
