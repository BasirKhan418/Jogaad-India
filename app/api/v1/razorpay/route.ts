import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import ConnectDb from "@/middleware/connectDb";
import Employee from "@/models/Employee";
import { writeLogToS3 } from "@/utils/s3Logger";
import Booking from "@/models/Booking";
import { sendRefundCompletedEmail } from "@/email/user/refundcomplete";
import { sendRefundInitiatedEmail } from "@/email/user/refundinitiated";
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
    const bookingdata = await Booking.findOne({ orderid: p.order_id });
    if (bookingdata && (bookingdata.isActive === false || bookingdata.intialPaymentStatus === "pending" || bookingdata.status !== "confirmed")) {
      await Booking.findOneAndUpdate(
        { orderid: p.order_id },
        {
          intialPaymentStatus: "paid",
          status: "confirmed",
          paymentid: p.id,
          isActive: true,
        }
      );
      addLog(`Booking record updated for orderid: ${p.order_id}`);
    }
    else {
      await Booking.findOneAndUpdate(
        { orderid: p.order_id },
        {
          paymentid: p.id,
          status: "completed",
          isActive: true,
          isDone: true
        }
      );
      addLog(`Booking record paymentid updated for orderid: ${p.order_id}`);
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
    const bookingdata = await Booking.findOne({ orderid: p.order_id });
    if (bookingdata && (bookingdata.isActive === false || bookingdata.intialPaymentStatus === "pending" || bookingdata.status !== "confirmed")) {
      await Booking.findOneAndUpdate(
        { orderid: p.order_id },
        {
          intialPaymentStatus: "failed",
          status: "pending",
        }
      );
      addLog(`Booking record updated for orderid: ${p.order_id}`);
    }
    else {
      await Booking.findOneAndUpdate(
        { orderid: p.order_id },
        {
          paymentStatus: "failed",
          status: "in-progress",
          isActive: true,
          isDone: false
        }
      );
      addLog(`Booking record paymentStatus updated for orderid: ${p.order_id}`);
    }
  }
  if (event === "refund.created") {
    const r = data.payload.refund.entity;
    addLog(`Refund created: ${JSON.stringify(r)}`);

    const booking = await Booking.findOneAndUpdate(
      { paymentid: r.payment_id },
      {
        refundStatus: "initiated",
        refundid: r.id,
        refundAmount: Math.floor((r.amount) / 100) || 0,
        refundDate: new Date(),
        status: "refunded",
      }
    ).populate("userid").populate("categoryid");
    if (booking) {
      sendRefundInitiatedEmail({
        name: booking.userid.name,
        email: booking.userid.email,
        serviceName: booking.categoryid.name,
        orderId: booking.orderid,
      })
    }

    addLog(`Booking refund initiated for payment: ${r.payment_id}`);
  }
  if (event === "refund.processed") {
    const r = data.payload.refund.entity;
    addLog(`Refund processed: ${JSON.stringify(r)}`);

    const booking = await Booking.findOneAndUpdate(
      { paymentid: r.payment_id },
      {
        refundStatus: "processed",
        refundid: r.id,
        refundAmount: Math.floor((r.amount) / 100) || 0,
        refundDate: new Date(),
        status: "refunded",
      }
    ).populate("categoryid").populate("userid");
    if( booking ) {
      sendRefundCompletedEmail({
        name: booking.userid.name,
        email: booking.userid.email,
        serviceName: booking.categoryid.name,
        orderId: booking.orderid,
      })
    }
    addLog(`Booking refund processed for payment: ${r.payment_id}`);
  }
  if (event === "refund.failed") {
    const r = data.payload.refund.entity;
    addLog(`Refund failed: ${JSON.stringify(r)}`);

    await Booking.findOneAndUpdate(
      { paymentid: r.payment_id },
      {
        refundStatus: "failed",
        refundDate: new Date(),
      }
    );
    addLog(`Booking refund failed for payment: ${r.payment_id}`);
  }

  addLog("Webhook processed successfully");

  // Write all logs in ONE SAFE write
  await writeLogToS3(logs.join("\n"));

  return NextResponse.json({ status: "ok" });
}


export const GET = () => {
  return NextResponse.json({ message: "Razorpay Webhook Endpoint V2" });
}