import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import ConnectDb from "@/middleware/connectDb";
import Employee from "@/models/Employee";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function rawBody(request: NextRequest) {
  const reader = request.body?.getReader();
  const chunks = [];

  if (!reader) return Buffer.from("");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(request: NextRequest) {
  const bodyBuffer = await rawBody(request);
  const signature = request.headers.get("x-razorpay-signature")!;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(bodyBuffer)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const data = JSON.parse(bodyBuffer.toString());
  const event = data.event;

  await ConnectDb();

  if (event === "payment.captured") {
    const payment = data.payload.payment.entity;
    console.log("Payment captured:", payment);

    await Employee.findOneAndUpdate(
      { email: payment.email },
      {
        isPaid: true,
        isActive: true,
        paymentid: payment.id,
        paymentStatus: "paid",
        razorpay_order_id: payment.order_id
      }
    );
  }

  if (event === "payment.failed") {
    const payment = data.payload.payment.entity;

    await Employee.findOneAndUpdate(
      { email: payment.email },
      {
        isPaid: false,
        isActive: false,
        paymentStatus: "failed"
      }
    );
  }

  return NextResponse.json({ status: "ok" });
}

export async function GET() {
  return NextResponse.json({ message: "Razorpay Webhook Endpoint working fine" });
}
