import { z } from "zod";

export const PrivacyNoticeSchema = z.object({
  content: z
    .string()
    .min(10, "Should contain min of 10 characters!")
    .max(5000, "Should contain max of 5000 characters!"),
});

export type PrivacyNoticeValues = z.infer<typeof PrivacyNoticeSchema>;
