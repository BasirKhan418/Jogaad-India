import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import ConnectDb from "@/middleware/connectDb";
import Employee from "@/models/Employee";
import { writeLogToS3 } from "@/utils/s3Logger";
import Booking from "@/models/Booking";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();

  // Buffer logs in memory
  let logs: string[] = [];
  const addLog = (msg: string) => logs.push(msg);

  addLog("Webhook received");
  addLog(`Raw body: ${body}`);

  const signature = request.headers.get("x-razorpay-signature")!;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    addLog("❌ Invalid webhook signature");
    await writeLogToS3(logs.join("\n"));
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const data = JSON.parse(body);
  const event = data.event;

  addLog(`Event received: ${event}`);

  await ConnectDb();

  if (event === "payment.captured") {
    const p = data.payload.payment.entity;
    addLog(`Payment captured: ${JSON.stringify(p)}`);

    const empdata = await Employee.findOneAndUpdate(
      { email: p.email },
      {
        isPaid: true,
        isActive: true,
        paymentid: p.id,
        paymentStatus: "paid",
        orderid: p.order_id,
      }
    );
    if (empdata) {
      addLog(`Employee record updated for email: ${p.email}`);
    }
    const bookingdata =await Booking.findOne({orderid:p.order_id});
    if(bookingdata.isActive===false||bookingdata.intialpaymentStatus==="pending"||bookingdata.status!=="confirmed"){
      await Booking.findOneAndUpdate(
        { orderid: p.order_id },
        {
          intialpaymentStatus: "paid",
          status: "confirmed",
          paymentid: p.id,
          isActive: true,
        }
      );
      addLog(`Booking record updated for orderid: ${p.order_id}`);
    }
    else{
      //add update of complete payment
    }
  }

  if (event === "payment.failed") {
    const p = data.payload.payment.entity;
    addLog(`Payment failed: ${JSON.stringify(p)}`);

    await Employee.findOneAndUpdate(
      { email: p.email },
      {
        isPaid: false,
        isActive: false,
        paymentStatus: "failed",
      }
    );
    const bookingdata =await Booking.findOne({orderid:p.order_id});
    if(bookingdata.isActive===false||bookingdata.intialpaymentStatus==="pending"||bookingdata.status!=="confirmed"){
      await Booking.findOneAndUpdate(
        { orderid: p.order_id },
        {
          intialpaymentStatus: "failed",
          status: "pending",
        }
      );
      addLog(`Booking record updated for orderid: ${p.order_id}`);
    }
    else{
      //add update of complete payment
    }
  }

  addLog("Webhook processed successfully");

  // Write all logs in ONE SAFE write
  await writeLogToS3(logs.join("\n"));

  return NextResponse.json({ status: "ok" });
}


export const GET = () => {
    return NextResponse.json({ message: "Razorpay Webhook Endpoint V2" });
}