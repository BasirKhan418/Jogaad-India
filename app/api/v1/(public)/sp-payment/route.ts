import { NextResponse,NextRequest } from "next/server";
import { getemployeeByOrderId } from "@/repository/employee/employee.auth";

export const GET = async (request: NextRequest) => {
    try{
        const url = new URL(request.url);
        const orderid = url.searchParams.get("id") || "";
        if(!orderid){
            return NextResponse.json({message:"Order ID is required",success:false},{status:400});
        }
        const employeeData = await getemployeeByOrderId(orderid);
        if(!employeeData.success){
            return NextResponse.json({message:"Employee not found",success:false,status:"error"},{status:404});
        }
        if(!employeeData.data?.isPaid){
            return NextResponse.json({message:"Employee payment pending",success:true,status:"pending",data:employeeData.data},{status:200});
        }
        else if(employeeData.data?.isPaid){
            return NextResponse.json({message:"Employee payment completed",success:true,status:"paid",data:employeeData.data},{status:200});
        }

        return NextResponse.json({message:"No methods found",success:false ,status:"error"},{status:200});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false},{status:500});
    }
}