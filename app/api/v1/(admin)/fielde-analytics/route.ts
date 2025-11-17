import { NextResponse,NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { getFieldExecutiveAnalyticsAdmin } from "@/repository/admin/fieldexecutive";
export const GET = async (request:NextRequest) => {
    try{
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="admin"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const url = new URL(request.url);
        const email = url.searchParams.get("email");
        if(!email){
            return NextResponse.json({message:"Email parameter is required",success:false}, {status:400});
        }
        const analyticsData = await getFieldExecutiveAnalyticsAdmin(email);
        if(!analyticsData.success){
            return NextResponse.json({message:"Error fetching analytics data",success:false}, {status:500});
        }
        return NextResponse.json({message:"Analytics data fetched successfully",success:true,data:analyticsData.data}, {status:200});


    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}