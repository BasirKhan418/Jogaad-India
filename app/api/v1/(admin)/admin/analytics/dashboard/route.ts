import { NextResponse,NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { getallData } from "@/repository/admin/analytics/dashboard";
import { getDataByDateRange } from "@/repository/admin/analytics/dashboard";
export const GET = async (request: NextRequest) => {
    try{
        const cookieStore = await cookies();
        const userToken = cookieStore.get("token")?.value || "";
        const verifyResult = await verifyUserToken(userToken);
        if(!verifyResult.success||verifyResult.type!=="admin"){
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            }, { status: 401 });
        }
        const url = new URL(request.url);
        const params = url.searchParams;
        const startDate = params.get("startDate");
        const endDate = params.get("endDate");
        if(!startDate || !endDate){
            const allData =  await getallData();
            return NextResponse.json(allData);
        }
        const response = await getDataByDateRange(startDate, endDate);
        return NextResponse.json(response);

    }
    catch(error){
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });
    }
}