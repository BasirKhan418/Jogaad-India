import { NextResponse,NextRequest} from "next/server";
import { EmployeeOtpSchema } from "@/validator/employee/employee.auth";
import { verifyOTPEmployee } from "@/repository/employee/employee.auth2";
import { cookies } from "next/headers";
export async function POST(request:NextRequest) {
    try{
        const data = await request.json();
        const cookiesStore = await cookies();
        const validateData = EmployeeOtpSchema.safeParse(data);
        if(!validateData.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const response = await verifyOTPEmployee(validateData.data.email, validateData.data.otp);
        
        if(response.success && response.token){
            cookiesStore.set("token", response.token || "", {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });
            
        }
        
        return NextResponse.json(response, {status: response.success ? 200 : 400});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}
