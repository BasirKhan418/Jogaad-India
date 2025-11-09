import { NextResponse,NextRequest } from "next/server";
import {verifyOTP } from "@/repository/user/user.auth";
import { userOtpSchema } from "@/validator/user/user.auth";
import { cookies } from "next/headers";
export async function POST(request:NextRequest) {
    try{
        const cookieStore = await cookies();
       const {email,otp} = await request.json();
       const validatedOtp = userOtpSchema.safeParse({email, otp});
       if(!validatedOtp.success){
           return NextResponse.json({message:"Invalid data",success:false}, {status:400});
       }
         const response = await verifyOTP(email,otp);
         if(response.success){
            cookieStore.set("token", response.token||"", {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            });
            return NextResponse.json(response);

         }
         return NextResponse.json({message:response.message,success:false}, {status:400});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}