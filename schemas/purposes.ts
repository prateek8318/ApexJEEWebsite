import { z } from "zod";
import { isAlphanumeric } from "validator";

export const AddPurposeSchema = z.object({
  purpose: z
    .string()
    .min(3, "Should contain min of 3 characters!")
    .max(100, "Should contain max of 100 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " -_&()" }),
      "Invalid characters found!",
    ),
  activities: z
    .string()
    .min(3, "Should contain min of 3 characters!")
    .max(100, "Should contain max of 100 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " -_&()" }),
      "Invalid characters found!",
    ),
  category: z
    .string()
    .min(2, "Should contain min of 2 characters!")
    .max(50, "Should contain max of 50 characters!")
    .refine(
      (data) => isAlphanumeric(data, "en-US", { ignore: " -_&()" }),
      "Invalid characters found!",
    ),
  lifetime: z.number().min(1, "Lifetime must be at least 1 day"),
});
