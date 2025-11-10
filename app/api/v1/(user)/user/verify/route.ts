import { NextResponse,NextRequest } from "next/server";
import { verifyUserByEmail } from "@/repository/user/user.auth";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
export async function GET(request:NextRequest) {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const response = await verifyUserByEmail(isTokenValid.email);
        if(response.success){
            return NextResponse.json({
                message: response.message,
                success: true,
                data: response.user
            });
        }
        return NextResponse.json({message:response.message,success:false}, {status:400});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}