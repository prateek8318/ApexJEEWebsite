import { z } from "zod";
import { isStrongPassword } from "validator";

export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .max(20, "Should contain max of 20 characters!")
      .refine(data => isStrongPassword(data), "Should contain min of 8 characters and 1 uppercase, 1 lowercase, 1 number and 1 special character!"),
    confirmPassword: z.string().min(1, "This field is required!"),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match!",
  });
