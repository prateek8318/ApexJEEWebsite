import * as z from "zod";

export const apiKeySchema = z.object({
  name: z.string().min(1, { message: "Key name is required" }),
  restriction: z.string().min(1, { message: "Restriction is required" }),
});

export const webhookSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }).min(1, { message: "URL is required" }),
  type: z.string().min(1, { message: "Event type is required" }),
});

export type ApiKeyFormValues = z.infer<typeof apiKeySchema>;
export type WebhookFormValues = z.infer<typeof webhookSchema>;
