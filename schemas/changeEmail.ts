import { z } from "zod";
import { isEmail, isNumeric } from "validator";

export const ChangeEmailSchema = z.object({
  email: z.string().refine((data) => isEmail(data), "Invalid email!"),
  otp: z
    .string()
    .length(6, "Invalid OTP!")
    .refine((data) => isNumeric(data), "Invalid OTP!"),
});
