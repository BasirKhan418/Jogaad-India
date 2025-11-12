import { NextResponse,NextRequest } from "next/server";
import { AdminLoginSchemaZod } from "@/validator/admin/admin.auth";
import { generateOTP } from "@/repository/admin/admin.auth";
export const POST = async (request:NextRequest) => {
    try{
        const data = await request.json();
        const validateData = AdminLoginSchemaZod.safeParse(data);
        if(!validateData.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const response = await generateOTP(validateData.data.email);
        return NextResponse.json(response);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}