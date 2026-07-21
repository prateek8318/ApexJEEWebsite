import { z } from "zod";

export const addActivitySchema = z.object({
    name: z.string().min(1, "Activity Name is required"),
    description: z.string().min(1, "Description is required"),
    processingCategory: z.string().min(2, "category is required")
});

export const updateActivitySchema = z.object({
    name: z.string().min(1, "Activity Name is required"),
    description: z.string().optional(),
    activities: z.string().optional(),
});
