import { NextResponse, NextRequest } from "next/server";
import ConnectDb from "@/middleware/connectDb";
import Booking from "@/models/Booking";
import crypto from "crypto";
import { sendServiceCompletionEmailUser } from "@/email/user/completebooking";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        console.log("Payment verification request received:", data);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = data;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !email) {
            return NextResponse.json({
                message: "Missing required payment details",
                success: false
            }, { status: 400 });
        }

        await ConnectDb();

        // Verify Razorpay signature
        const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!razorpaySecret) {
            return NextResponse.json({
                message: "Payment configuration error",
                success: false
            }, { status: 500 });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", razorpaySecret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json({
                message: "Payment verification failed. Invalid signature.",
                success: false
            }, { status: 400 });
        }

        // Update booking with payment details
        const booking = await Booking.findOneAndUpdate(
            { orderid: razorpay_order_id },
            {
                paymentStatus: "paid",
                status: "completed",
                paymentid: razorpay_payment_id,
                isActive: true,
                isDone: true
            },
            { new: true }
        ).populate("categoryid").populate("userid");
        //send email to user for booking completed 

        if (!booking) {
            return NextResponse.json({
                message: "Booking not found",
                success: false
            }, { status: 404 });
        }

        // Send confirmation email to user
        sendServiceCompletionEmailUser({
            name: booking.userid.name,
            email: booking.userid.email,
            serviceName: booking.categoryid.categoryName,
            bookingId: booking._id.toString()
        });
        

        return NextResponse.json({
            message: "Payment verified successfully. Your booking is now confirmed!",
            success: true,
            booking: booking
        }, { status: 200 });

    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json({
            message: "Internal server error during payment verification",
            success: false
        }, { status: 500 });
    }
}
