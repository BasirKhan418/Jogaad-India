import { z } from "zod";

export const EmployeeZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  address: z.string().optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  pincode: z.string().length(6, "Pincode must be exactly 6 digits").regex(/^\d{6}$/, "Pincode must contain only numbers"),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankIfscCode: z.string().optional(),
  img: z.string().url("Invalid image URL").optional().or(z.literal('')),
  categoryid: z.string().optional(), // MongoDB ObjectId as string
  payrate: z.number().optional(),
});
export type EmployeeInput = z.infer<typeof EmployeeZodSchema>;
export const EmployeeLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
});
export const EmployeeOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});
