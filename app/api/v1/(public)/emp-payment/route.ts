import { NextResponse,NextRequest } from "next/server";
import { getFieldExecutiveById } from "@/repository/fieldexecutive/auth";

export const GET = async (request: NextRequest) => {
    try{
        const url = new URL(request.url);
        const userid = url.searchParams.get("id") || "";
        if(!userid){
            return NextResponse.json({message:"User ID is required",success:false},{status:400});
        }
        const fieldExecData = await getFieldExecutiveById(userid);
        if(!fieldExecData.success){
            return NextResponse.json({message:"Field Executive not found",success:false,status:"error"},{status:404});
        }
        if(!fieldExecData.data?.isPaid){
            return NextResponse.json({message:"Field Executive payment pending",success:true,status:"pending",data:fieldExecData.data},{status:200});
        }
        else if(fieldExecData.data?.isPaid){
            return NextResponse.json({message:"Field Executive payment completed",success:true,status:"paid",data:fieldExecData.data},{status:200});
        }

        return NextResponse.json({message:"No methods found",success:false ,status:"error"},{status:200});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false},{status:500});
    }
}