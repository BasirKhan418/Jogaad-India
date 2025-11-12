import { NextResponse ,NextRequest} from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
export const GET = async (request:NextRequest) => {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value||"";
        console.log("Token:", token);
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        else if(isTokenValid.type !== "admin"){
            return NextResponse.json({message:"Unauthorized access",success:false}, {status:403});
        }
        return NextResponse.json({message:"Token is valid",success:true});

    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}