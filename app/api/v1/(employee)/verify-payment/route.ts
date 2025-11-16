import { NextResponse, NextRequest } from "next/server";
import ConnectDb from "@/middleware/connectDb";
import Employee from "@/models/Employee";
import crypto from "crypto";
import setConnectionRedis from "@/middleware/connectRedis";


export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
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
        const employee = await Employee.findOneAndUpdate(
            { email },
            {
                isPaid: true,
                isActive: true,
                paymentid: razorpay_payment_id,
                paymentStatus: "paid"
            },
            { new: true }
        );

        if (!employee) {
            return NextResponse.json({
                message: "Employee account not found",
                success: false
            }, { status: 404 });
        }

        // Clear Redis cache for order
        const redisClient = setConnectionRedis();
        await redisClient.del(`employee_${email}_order`);

        return NextResponse.json({
            message: "Payment verified successfully. Your account is now active!",
            success: true,
            employee: {
                email: employee.email,
                name: employee.name,
                isPaid: employee.isPaid,
                isActive: employee.isActive
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json({
            message: "Internal server error during payment verification",
            success: false
        }, { status: 500 });
    }
}
