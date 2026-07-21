import { z } from "zod";

export const addPurposeSchema = z.object({
    name: z.string().min(1, "Purpose Name is required"),
    description: z.string().min(1, "Description is required"),
    activities: z.string().optional(),
    expiryPeriod: z.string().optional(),
});

export const updatePurposeSchema = z.object({
    name: z.string().min(1, "Purpose Name is required"),
    description: z.string().min(1, "Description is required"),
    activities: z.string().optional(),
    expiryPeriod: z.string().optional(),
});
