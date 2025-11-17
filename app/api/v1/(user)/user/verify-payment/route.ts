import { NextResponse, NextRequest } from "next/server";
import ConnectDb from "@/middleware/connectDb";
import Booking from "@/models/Booking";
import crypto from "crypto";
import { sendBookingConfirmationEmail } from "@/email/user/sendWelcome";
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

        // Verify signature
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

        // Update employee account
        const booking = await Booking.findOneAndUpdate(
            { orderid: razorpay_order_id }, {
            intialpaymentStatus: "paid",
            status: "confirmed",
            paymentid: razorpay_payment_id,
            isActive: true,

        }, { new: true }).populate("categoryid");
        if (!booking) {
            return NextResponse.json({
                message: "Booking not found",
                success: false
            }, { status: 404 });
        }
        //send confirm email to user
        sendBookingConfirmationEmail({
            name: booking.name,
            email: booking.email,
            serviceName: booking.categoryid.name
        });

        return NextResponse.json({
            message: "Payment verified successfully. Your account is now active!",
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
