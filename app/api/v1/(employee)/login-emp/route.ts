import { NextResponse,NextRequest} from "next/server";
import { EmployeeLoginSchema } from "@/validator/employee/employee.auth";

export async function POST(request:NextRequest) {
    try{
        
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}
