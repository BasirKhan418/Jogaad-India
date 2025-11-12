import { NextResponse,NextRequest} from "next/server";
import { EmployeeLoginSchema } from "@/validator/employee/employee.auth";
import { SendOtpEmployee } from "@/repository/employee/employee.auth2";
export async function POST(request:NextRequest) {
    try{
        const data = await request.json();
        const validateData = EmployeeLoginSchema.safeParse(data);
        if(!validateData.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const response = await SendOtpEmployee(validateData.data.email);
        if(response.success){
            return NextResponse.json({message:response.message,success:true}, {status:200});
        }
        return NextResponse.json({message:response.message,success:false}, {status:400});

    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}
