import { z } from "zod";
import { isEmail } from "validator";

export const ForgotPasswordSchema = z.object({
  email: z.string().refine((data) => isEmail(data), "Invalid email!"),
});
