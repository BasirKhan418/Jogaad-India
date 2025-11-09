import { NextResponse,NextRequest } from "next/server";
import { generateOTP } from "@/repository/user/user.auth";

import { userLoginSchema } from "@/validator/user/user.auth";
export async function POST(request:NextRequest) {
    try{
        const email = await request.json();
        const validatedata = userLoginSchema.safeParse(email);
        if(!validatedata.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const {email: userEmail} = validatedata.data;
        const response = await generateOTP(userEmail);
        if(response.success){
            return NextResponse.json({message:response.message,otp:response.otp,success:true}, {status:200});
        }
        return NextResponse.json({message:response.message,success:false}, {status:400});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}