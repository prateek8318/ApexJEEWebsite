import { z } from "zod";

export const grievanceTicketStatusEnum = z.enum([
  "pending",
  "in_progress",
  "resolved",
]);

export const grievanceResponseSchema = z.object({
  ticketId: z.string().min(1, "Ticket id is required"),
  draftResponse: z
    .string()
    .min(1, "Response is required")
    .max(4000, "Response is too long"),
  status: grievanceTicketStatusEnum,
});

export type GrievanceTicketStatusEnum = z.infer<
  typeof grievanceTicketStatusEnum
>;
export type GrievanceResponseValues = z.infer<typeof grievanceResponseSchema>;
