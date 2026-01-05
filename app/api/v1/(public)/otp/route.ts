import { NextResponse,NextRequest } from "next/server";
import setConnectionRedis from "@/middleware/connectRedis";
import { sendOtpEmail } from "@/email/user/sendOtp";
export const GET = async (request: NextRequest) => {
    try{
        const url = new URL(request.url);
        const redis = setConnectionRedis();
        const email = url.searchParams.get("email") || ""; 
        
        if(!email){
            return NextResponse.json({message:"Email is required",success:false},{status:400});
        } 
        //rate limiting - max 5 requests per minute per email
        const count = await redis.get(`${email}`);
        if(!count){
            await redis.set(`${email}`,"0","EX",60);
        }
        else if(parseInt(count) >=5){
            return NextResponse.json({message:"Too many requests. Please try again later.",success:false},{status:429});
        }
        else{
            await redis.incr(`${email}`);
        }
        //end rate limiting
        //otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await redis.set(`otp-${email}`,otp,"EX",300);
        await sendOtpEmail({email, otp});
        return NextResponse.json({message:"OTP sent successfully",success:true},{status:200});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false},{status:500});
    }
}
export const POST = async (request: NextRequest) => {
    try{
        const reqBody = await request.json();
        const redis = setConnectionRedis();
        const {email, otp} = reqBody;
    if(!email || !otp){
        return NextResponse.json({message:"Email and OTP are required",success:false},{status:400});
    }
    // Add OTP verification logic here
    const storedOtp = await redis.get(`otp-${email}`);
    if(storedOtp !== otp){
        return NextResponse.json({message:"Invalid or expired OTP",success:false},{status:400});
    }
    return NextResponse.json({message:"OTP verified successfully",success:true},{status:200});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false},{status:500});
    }
}