import { z } from "zod";
import { isEmail } from "validator";

export const LoginSchema = z.object({
  email: z.string().refine((data) => isEmail(data), "Invalid Email!"),
  password: z
    .string()
    .min(6, "Should contain min of 6 characters!")
    .max(50, "Should contain max of 50 characters!"),
});
