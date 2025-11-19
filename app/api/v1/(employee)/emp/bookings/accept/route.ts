import { NextResponse,NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import {cookies} from "next/headers";
import { getEmployeeByEmail } from "@/repository/employee/employee.auth";
import { AcceptScheduleForBooking } from "@/repository/employee/booking";
export const POST = async (request: NextRequest) => {
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
        const employee = await getEmployeeByEmail(verifyResult.email);
        if(!employee.success){
            return NextResponse.json({
                message: "Employee not found",
                success: false
            }, { status: 404 });
        }
        const {bookingId} = await request.json();
        const acceptResult = await AcceptScheduleForBooking(bookingId, employee.data._id);
        return NextResponse.json(acceptResult);
    }
    catch(error){
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });
    }
}