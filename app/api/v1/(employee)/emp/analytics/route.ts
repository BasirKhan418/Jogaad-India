import { NextResponse,NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import {cookies} from "next/headers";
import { getEmployeeAnalytics } from "@/repository/employee/analytics";
import { getEmployeeAnalyticsByDateRange } from "@/repository/employee/analytics";
import { getEmployeeByEmail } from "@/repository/employee/employee.auth";
export const GET = async (request: NextRequest) => {
    try{
        const cookieStore = await cookies();
        const userToken = cookieStore.get("token")?.value || "";
        const verifyResult = await verifyUserToken(userToken);
        if(!verifyResult.success||verifyResult.type!=="employee"){
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            }, { status: 401 });
        }
        const url = new URL(request.url);
        const startDate = url.searchParams.get("startDate");
        const endDate = url.searchParams.get("endDate");
        const employee = await getEmployeeByEmail(verifyResult.email);
        if(!employee.success || !employee.data){
            return NextResponse.json({
                message: "Employee not found",
                success: false
            }, { status: 404 });
        }
        if(!startDate||!endDate){
            const analyticsResult = await getEmployeeAnalytics(employee.data._id.toString());
            return NextResponse.json(analyticsResult);
        } 
        const analyticsResult = await getEmployeeAnalyticsByDateRange(employee.data._id.toString(), new Date(startDate), new Date(endDate));
        return NextResponse.json(analyticsResult);
    }
    catch(error){
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });
    }
}