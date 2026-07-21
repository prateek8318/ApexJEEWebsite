import { z } from "zod";
import { isMobilePhone, isNumeric } from "validator";

export const ChangeContactNoSchema = z.object({
  contactNo: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "This field is required!" : undefined,
    })
    .refine(
      (data) => isMobilePhone(data, "any", { strictMode: true }),
      "Invalid contact no.!",
    ),
  otp: z
    .string()
    .length(6, "Invalid OTP!")
    .refine((data) => isNumeric(data), "Invalid OTP!"),
});
