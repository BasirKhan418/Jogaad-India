import { z } from "zod";

export const AdminSchemaZod = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  img: z.string().optional(),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional(),
  isSuperAdmin: z.boolean().optional().default(false),
});

export const AdminLoginSchemaZod = z.object({
  email: z.string().email("Invalid email address"),
});
export const AdminUpdateSchemaZod = z.object({
  name: z.string().min(1, "Name is required").optional(),
  img: z.string().url("Invalid image URL").optional(),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional(),
  isSuperAdmin: z.boolean().optional(),
});
export const AdminOtpSchemaZod = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type AdminInput = z.infer<typeof AdminSchemaZod>;
export type AdminLoginInput = z.infer<typeof AdminLoginSchemaZod>;
export type AdminUpdateInput = z.infer<typeof AdminUpdateSchemaZod>;