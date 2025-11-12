import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().optional(),
  phone: z.string(),
  isImposedFine: z.boolean().default(false),
  img: z.string().url("Invalid image URL").optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export const userOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  img: z.string().url("Invalid image URL").optional(),
});