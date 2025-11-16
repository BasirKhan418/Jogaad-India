import { NextResponse, NextRequest } from "next/server";
import { verifyFieldExecutiveOtp } from "@/repository/fieldexecutive/auth";
import { FieldExecutiveOtpVerifySchema } from "@/validator/fieldexecutive/field.validator";
import { cookies } from "next/headers";
export const POST = async (request: Request) => {
    try {
        const reqBody = await request.json();
        const parseResult = FieldExecutiveOtpVerifySchema.safeParse(reqBody);
        if (!parseResult.success) {
            return NextResponse.json({ message: "Invalid request data", success: false, errors: parseResult.error.format() }, { status: 400 });
        }
        const cookiesStore = await cookies();
        const response = await verifyFieldExecutiveOtp(reqBody.email, reqBody.otp);
        if (!response.success) {
            return NextResponse.json({ message: response.message, success: false }, { status: 400 });
        }
        cookiesStore.set("token", response.token || "", {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        return NextResponse.json(response);

    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}