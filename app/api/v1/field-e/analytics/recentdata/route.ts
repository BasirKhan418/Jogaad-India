import { NextResponse,NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { getAllEmployeesUnderFieldExec } from "@/repository/fieldexecutive/analytics";
import { getEmployeesUnderFieldExecByPage } from "@/repository/fieldexecutive/analytics";
export const GET = async (request:NextRequest) => {
    try{
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="field-exec"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
      const url = new URL(request.url);
        const start = url.searchParams.get("start");
        const limit = url.searchParams.get("limit");
        if(!start||!limit){
            //fire raw quesries
            const response = await getAllEmployeesUnderFieldExec(isTokenValid.email);
            if(!response.success){
                return NextResponse.json({message:"Error fetching recent data",success:false}, {status:500});
            }
            return NextResponse.json({message:"Recent data fetched successfully",success:true,data:response.data}, {status:200});
        }
        //fetch recent data based on date range
        const startNum = parseInt(start);
        const limitNum = parseInt(limit);
        const response = await getEmployeesUnderFieldExecByPage(isTokenValid.email,startNum,limitNum);
        if(!response.success){
            return NextResponse.json({message:"Error fetching recent data",success:false}, {status:500});
        }
        return NextResponse.json({message:"Recent data fetched successfully",success:true,data:response.data}, {status:200});

    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}