import { NextResponse ,NextRequest} from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
export const GET = async (request:NextRequest) => {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        console.log(isTokenValid);
        if(!isTokenValid.success){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        else if(isTokenValid.type !== "field-exec"){
            return NextResponse.json({message:"Unauthorized access",success:false}, {status:403});
        }
        return NextResponse.json({message:"Token is valid",success:true});

    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}