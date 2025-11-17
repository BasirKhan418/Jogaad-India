import { z } from "zod";

export const BookingStatusEnum = z.enum([
  "pending",
  "confirmed",
  "in-progress",
  "started",
  "completed",
  "cancelled",
  "refunded"
]);

export const BookingSchemaZod = z.object({
  userid: z.string().min(1, "User ID is required"),
  categoryid: z.string().min(1, "Category ID is required"),
  employeeid: z.string().optional(),

  status: BookingStatusEnum,

  bookingDate: z.string().datetime({ offset: true }),

  isActive: z.boolean().default(false),
  isDone: z.boolean().default(false),

  intialamount: z.number(),
  bookingAmount: z.number().optional(),

  orderid: z.string().min(1, "Order ID is required"),
  paymentid: z.string().optional(),

  paymentStatus: z.string().optional(),
  intialPaymentStatus: z.string().optional(),

  feedback: z.string().optional(),
  rating: z.number().optional(),
});
