import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import ConnectDb from "@/middleware/connectDb";
import Employee from "@/models/Employee";
import { writeLogToS3 } from "@/utils/s3Logger";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();

  // Basic logs
  writeLogToS3("Webhook received");
  writeLogToS3(`Raw body: ${body}`);

  // Verify Signature
  const signature = request.headers.get("x-razorpay-signature")!;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    writeLogToS3("❌ Invalid webhook signature");
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // Parse data
  const data = JSON.parse(body);
  const event = data.event;
  writeLogToS3(`Event received: ${event}`);

  await ConnectDb();

  // Success Case
  if (event === "payment.captured") {
    const p = data.payload.payment.entity;

    writeLogToS3(`Payment captured: ${JSON.stringify(p)}`);

    await Employee.findOneAndUpdate(
      { email: p.email },
      {
        isPaid: true,
        isActive: true,
        paymentid: p.id,
        paymentStatus: "paid",
        orderid: p.order_id,
      }
    );
  }

  // Failure Case
  if (event === "payment.failed") {
    const p = data.payload.payment.entity;

    writeLogToS3(`Payment failed: ${JSON.stringify(p)}`);

    await Employee.findOneAndUpdate(
      { email: p.email },
      {
        isPaid: false,
        isActive: false,
        paymentStatus: "failed",
      }
    );
  }

  writeLogToS3("Webhook processed successfully");

  return NextResponse.json({ status: "ok" });
}
