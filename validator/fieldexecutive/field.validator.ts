import { z } from "zod";

export const FieldExecutiveSchemaZod = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  address: z.string().optional(),
  pincode: z.string().optional(),
  block: z.string().optional(),
  isActive: z.boolean().optional(), // defaults handled in backend
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  img: z.string().optional(),
});
export type FieldExecutiveType = z.infer<typeof FieldExecutiveSchemaZod>;
export const FieldExecutiveLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
});
export const FieldExecutiveOtpVerifySchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});
export type FieldExecutiveLoginType = z.infer<typeof FieldExecutiveLoginSchema>;

