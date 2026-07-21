import { z } from "zod";
import {
  isAlpha,
  isAlphanumeric,
  isEmail,
  isEmpty,
  isMobilePhone,
  isPostalCode,
} from "validator";

export const UserSchema = z
  .object({
    title: z.string().min(1, "This field is required!"),
    firstName: z
      .string()
      .min(3, "Should contain min of 3 characters!")
      .max(30, "Should contain max of 30 characters!")
      .refine(
        (data) => isAlpha(data, "en-US", { ignore: " " }),
        "Invalid characters found!",
      ),
    middleName: z
      .string()
      .max(30, "Should contain max of 30 characters!")
      .optional()
      .refine(
        (data) =>
          isAlpha(data as string, "en-US", { ignore: " " }) ||
          isEmpty(data ? data : ""),
        "Invalid characters found!",
      ),
    lastName: z
      .string()
      .min(3, "Should contain min of 3 characters!")
      .max(30, "Should contain max of 30 characters!")
      .refine(
        (data) => isAlpha(data, "en-US", { ignore: " " }),
        "Invalid characters found!",
      ),
    gender: z.string().min(1, "This field is required!"),
    dateOfBirth: z
      .date({
        error: (issue) =>
          issue.input === undefined ? "This field is required!" : undefined,
      })
      .optional(),
    email: z.string().refine((data) => isEmail(data), "Invalid email!"),
    contactNo: z
      .string({
        error: (issue) =>
          issue.input === undefined ? "This field is required!" : undefined,
      })
      .refine(
        (data) => isMobilePhone(data, "any", { strictMode: true }),
        "Invalid contact no.!",
      ),
    languages: z.array(z.string()).min(1, "This field is required!"),
    ethnicity: z.string().min(1, "This field is required!"),
    nationality: z.string().min(1, "This field is required!"),
    addressLine1: z
      .string()
      .min(10, "Should contain min of 10 characters!")
      .max(100, "Should contain max of 100 characters!")
      .refine(
        (data) => isAlphanumeric(data, "en-US", { ignore: " '@#%&?!,.:()-/" }),
        "Invalid characters found!",
      ),
    addressLine2: z
      .string()
      .max(100, "Should contain max of 100 characters!")
      .optional()
      .refine(
        (data) =>
          isAlphanumeric(data ? data : "", "en-US", {
            ignore: " '@#%&?!,.:()-/",
          }) || isEmpty(data ? data : ""),
        "Invalid characters found!",
      ),
    city: z
      .string()
      .min(5, "Should contain min of 5 characters!")
      .max(30, "Should contain max of 30 characters!")
      .refine(
        (data) => isAlpha(data, "en-US", { ignore: " -" }),
        "Invalid characters found!",
      ),
    province: z
      .string()
      .max(30, "Should contain max of 30 characters!")
      .optional()
      .refine(
        (data) =>
          isAlpha(data ? data : "", "en-US", { ignore: " " }) ||
          isEmpty(data ? data : ""),
        "Invalid characters found!",
      ),
    country: z.string().min(1, "This field is required!"),
    zipCode: z
      .string()
      .refine((data) => isPostalCode(data, "any"), "Invalid zip code!"),
  })
  .refine((data) => data.dateOfBirth !== undefined, {
    path: ["dateOfBirth"],
    error: "This field is required!",
  });
