import { z } from "zod";

export const addCategorySchema = z.object({
    name: z.string().min(1, "Category Name is required"),
    description: z.string().min(1, "Description is required"),
    activities: z.string().optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1, "Category Name is required"),
    description: z.string().min(1, "Description is required"),
    activities: z.string().optional(),
});
