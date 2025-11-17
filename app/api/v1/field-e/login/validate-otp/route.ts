import { NextResponse, NextRequest } from "next/server";
import { FieldExecutiveOtpVerifySchema } from "@/validator/fieldexecutive/field.validator";
import { verifyFieldExecutiveOtp } from "@/repository/fieldexecutive/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const cookiesStore = await cookies();
        
        // Validate request data with Zod schema
        const validateData = FieldExecutiveOtpVerifySchema.safeParse(data);
        if (!validateData.success) {
            return NextResponse.json({
                message: "Invalid data",
                success: false,
                errors: validateData.error.format()
            }, { status: 400 });
        }

        // Verify OTP through repository layer
        const response = await verifyFieldExecutiveOtp(
            validateData.data.email,
            validateData.data.otp
        );
        
        // Set cookie if verification successful
        if (response.success && response.token) {
            cookiesStore.set("token", response.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'lax',
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            });
        }
        
        return NextResponse.json(response, {
            status: response.success ? 200 : 400
        });
        
    } catch (error) {
        console.error("Field executive OTP validation error:", error);
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });
    }
}
