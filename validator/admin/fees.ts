import { z } from "zod";

export const FeesSchemaZod = z.object({
  userOneTimeFee: z
    .number({
      message: "User one-time fee is required",
    })
    .min(0, "User one-time fee cannot be negative")
    .default(0),

  employeeOneTimeFee: z
    .number({
      message: "Employee one-time fee is required",
    })
    .min(0, "Employee one-time fee cannot be negative")
    .default(0),
    fineFees:z.number({
      message: "Fine fees is required",
    })
    .min(0, "Fine fees cannot be negative")
    .default(0),
});

export type FeesInput = z.infer<typeof FeesSchemaZod>;
