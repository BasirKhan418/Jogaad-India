import { z } from "zod";

export const CategorySchemaZod = z.object({
  categoryName: z
    .string()
    .min(3, "Category name must be at least 3 characters long")
    .max(100, "Category name is too long"),
  
  categoryType: z.enum(["Service", "Maintenance"] as const, "Category type is required"),
  
  categoryDescription: z
    .string()
    .min(5, "Description must be at least 5 characters long")
    .optional(),
  
  categoryUnit: z.string().optional(),
  
  recommendationPrice: z
    .number()
    .min(0, "Recommendation price cannot be negative")
    .max(100000, "Recommendation price too high")
    .default(0),
  
  categoryMinPrice: z
    .number()
    .min(0, "Min price cannot be negative")
    .optional(),
  
  categoryMaxPrice: z
    .number()
    .min(0, "Max price cannot be negative")
    .optional(),
  
  categoryStatus: z.boolean().default(true),
  
  img: z
    .string()
    .url("Invalid image URL")
    .optional(),
});

export type CategoryInput = z.infer<typeof CategorySchemaZod>;
