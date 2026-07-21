import { z } from "zod";
import { isNumeric, isStrongPassword } from "validator";

export const ChangePasswordAdminSchema = z
  .object({
    password: z
      .string()
      .max(20, "Should contain max of 20 characters!")
      .refine(
        (data) => isStrongPassword(data),
        "Should contain min of 8 characters and 1 uppercase, 1 lowercase, 1 number and 1 special character!",
      ),
    confirmPassword: z.string().min(8, "Should contain min of 8 characters!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match!",
  });

export const ChangePasswordUserSchema = z
  .object({
    currentPassword: z.string().min(6, "Should contain min of 6 characters!"),
    newPassword: z
      .string()
      .max(20, "Should contain max of 20 characters!")
      .refine(
        (data) => isStrongPassword(data),
        "Should contain min of 8 characters and 1 uppercase, 1 lowercase, 1 number and 1 special character!",
      ),
    confirmNewPassword: z
      .string()
      .min(8, "Should contain min of 8 characters!"),
    otp: z
      .string()
      .length(6, "Invalid OTP!")
      .refine((data) => isNumeric(data), "Invalid OTP!"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New & current password can't be same!",
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match!",
  });
