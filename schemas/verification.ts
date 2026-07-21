import { z } from "zod";
import { isNumeric } from "validator";

export const VerificationSchema = z.object({
  otp: z
    .string()
    .length(6, "Invalid OTP!")
    .refine(data => isNumeric(data), "Invalid OTP!"),
});
