import { z } from "zod";
import {
  isEmail,
  isMobilePhone,
  isStrongPassword,
  isAlpha,
  isAlphanumeric,
} from "validator";

export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(50, "Full name cannot exceed 50 characters")
      .refine(
        (value) => isAlpha(value.replace(/\s/g, ""), "en-US"),
        "Only alphabets are allowed"
      ),

    email: z
      .string()
      .min(1, "Email is required")
      .refine((value) => isEmail(value), "Invalid email address"),

    mobileNumber: z
      .string()
      .min(1, "Mobile number is required")
      .refine(
        (value) => isMobilePhone(value, "en-IN"),
        "Invalid mobile number"
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password cannot exceed 20 characters")
      .refine(
        (value) =>
          isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        "Password must contain uppercase, lowercase, number and special character"
      ),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),

    referralCode: z
      .string()
      .optional()
      .refine(
        (value) =>
          !value ||
          isAlphanumeric(value, "en-US", {
            ignore: "-_",
          }),
        "Invalid referral code"
      ),

    termsAccepted: z
      .boolean()
      .refine((value) => value === true, {
        message: "You must accept Terms & Conditions",
      }),
      
    profileImage: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormValues = z.infer<typeof RegisterSchema>;