import { NextResponse,NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { getFieldExecutiveAnalytics } from "@/repository/fieldexecutive/analytics";
export const GET = async (request:NextRequest) => {
    try{
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="field-exec"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const analyticsData = await getFieldExecutiveAnalytics(isTokenValid.email);
        if(!analyticsData.success){
            return NextResponse.json({message:"Error fetching analytics data",success:false}, {status:500});
        }
        return NextResponse.json({message:"Analytics data fetched successfully",success:true,data:analyticsData.data}, {status:200});


    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}