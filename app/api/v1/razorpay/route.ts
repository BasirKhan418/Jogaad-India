import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import ConnectDb from "@/middleware/connectDb";
import Employee from "@/models/Employee";
import { writeLog } from "@/utils/logger";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  writeLog("Webhook received");
  writeLog(`Raw body: ${body}`);

  const signature = request.headers.get("x-razorpay-signature")!;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    writeLog("Invalid webhook signature");
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const data = JSON.parse(body);
  const event = data.event;

  await ConnectDb();

  if (event === "payment.captured") {
    const p = data.payload.payment.entity;

    writeLog(`Payment captured: ${JSON.stringify(p)}`);

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

  if (event === "payment.failed") {
    const p = data.payload.payment.entity;

    writeLog(`Payment failed: ${JSON.stringify(p)}`);

    await Employee.findOneAndUpdate(
      { email: p.email },
      {
        isPaid: false,
        isActive: false,
        paymentStatus: "failed",
      }
    );
  }

  writeLog("Webhook processed successfully");
  return NextResponse.json({ status: "ok" });
}
