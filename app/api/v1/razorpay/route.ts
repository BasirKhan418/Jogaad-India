import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import ConnectDb from "@/middleware/connectDb";
import Employee from "@/models/Employee";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  console.log("webhook received");
  console.log("Raw body:", body);

  // Razorpay signature from header
  const signature = request.headers.get("x-razorpay-signature")!;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const data = JSON.parse(body);
  const event = data.event;

  await ConnectDb();

  if (event === "payment.captured") {
    const p = data.payload.payment.entity;
    console.log("Payment captured:", p);

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
    console.log("Payment failed:", p);

    await Employee.findOneAndUpdate(
      { email: p.email },
      {
        isPaid: false,
        isActive: false,
        paymentStatus: "failed",
      }
    );
  }

  return NextResponse.json({ status: "ok" });
}

export async function GET() {
  return NextResponse.json({
    message: "Webhook endpoint working v2",
  });
}
