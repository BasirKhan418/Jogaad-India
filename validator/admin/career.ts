import { z } from "zod";

export const careerSchema = z.object({
  role: z.string().min(1, "Role is required"),
  experience: z.string().min(1, "Experience is required"),

  requirements: z
    .array(z.string().min(1))
    .nonempty("At least one requirement is needed"),

  description: z.string().min(1, "Description is required"),

  location: z.string().min(1, "Location is required"),

  mode: z.enum(["remote", "offline", "hybrid"]),

  applyUrl: z
    .string()
    .url("Apply URL must be a valid URL"),

  salary: z.string().optional(),

  department: z.string().optional(),

  employmentType: z
    .enum(["full-time", "part-time", "contract", "internship"])
    .default("full-time"),

  skills: z.array(z.string()).optional(),

  benefits: z.array(z.string()).optional(),

  isActive: z.boolean().default(true),

  applicationDeadline: z.string().datetime().optional(),
});

// Type inference
export type CareerInput = z.infer<typeof careerSchema>;
