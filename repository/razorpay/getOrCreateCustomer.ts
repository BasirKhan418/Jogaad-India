import setConnectionRedis from "@/middleware/connectRedis";
import Razorpay from "razorpay";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function getOrCreateCustomer(data: {
  name: string;
  email: string;
  phone: string;
}) {
  const redisClient = setConnectionRedis();
  const redisKey = `rzp_customer_${data.email}`;

  const cached = await redisClient.get(redisKey);
  if (cached) return JSON.parse(cached);

  const customer = await razorpay.customers.create({
    name: data.name,
    email: data.email,
    contact: data.phone,
  });

  await redisClient.set(redisKey, JSON.stringify(customer), "EX", 24 * 60 * 60);
  return customer;
}
