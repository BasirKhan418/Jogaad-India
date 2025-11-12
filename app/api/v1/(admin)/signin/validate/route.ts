import { NextResponse,NextRequest } from "next/server";
import { AdminOtpSchemaZod } from "@/validator/admin/admin.auth";
import { verifyOTP } from "@/repository/admin/admin.auth";
import { cookies } from "next/headers";
export const POST = async (request:NextRequest) => {
    try{
        const data = await request.json();
        const cookieStore = await cookies();
        const validateData = AdminOtpSchemaZod.safeParse(data);
        if(!validateData.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const response = await verifyOTP(validateData.data.email, validateData.data.otp);
        if(response.success){
            cookieStore.set("token", response.token||"", {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            });
        }
        return NextResponse.json(response);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}