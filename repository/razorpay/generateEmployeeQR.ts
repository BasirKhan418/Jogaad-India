import setConnectionRedis from "@/middleware/connectRedis";
import { createUpiQrCode } from "../razorpay/createUpiQrCode";
import { updateOrderidByEmail } from "../employee/employee.auth";
import { getOrCreateCustomer } from "./getOrCreateCustomer";
import Razorpay from "razorpay";
 const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});
export async function generateEmployeeQR({
  email,
  name,
  phone,
  amount,
}: {
  email: string;
  name: string;
  phone: string;
  amount: number;
}) {
  const redisClient = setConnectionRedis();

  const existingQR = await redisClient.get(`employee_${email}_order`);
  if (existingQR) {
    return JSON.parse(existingQR);
  }

  const customer = await getOrCreateCustomer({ name, email, phone });

  const closeBy = Math.floor(Date.now() / 1000) + 17 * 60;

  const qr = await createUpiQrCode({
    type: "upi_qr",
    name: "Jogaad India",
    usage: "single_use",
    fixed_amount: true,
    payment_amount: amount,
    description: "For Service Provider Registration Fees - Jogaad India",
    customer_id: customer.id,
    close_by: closeBy,
    notes: { purpose: "For Service Provider Registration Fees - Jogaad India" },
  });

  const order = {
    id: qr.id,
    img: qr.image_url,
    amount: qr.payment_amount,
    currency: "INR",
  };

  await redisClient.set(
    `employee_${email}_order`,
    JSON.stringify(order),
    "EX",
    15 * 60
  );

  await updateOrderidByEmail(email, qr.id, qr.image_url || "");

  return order;
}
