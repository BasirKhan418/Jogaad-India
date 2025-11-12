import { NextResponse,NextRequest } from "next/server";
import { AdminLoginSchemaZod } from "@/validator/admin/admin.auth";
import { generateOTP } from "@/repository/admin/admin.auth";
import { cookies } from "next/headers";
import { AdminUpdateSchemaZod } from "@/validator/admin/admin.auth";
import { updateAdminByEmail } from "@/repository/admin/admin.auth";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
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

export const PUT = async (request:NextRequest) => {
    try{
        const data = await request.json();
        const validateData = AdminUpdateSchemaZod.safeParse(data);
        if(!validateData.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="admin"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const response = await updateAdminByEmail(isTokenValid.email, validateData.data);
        return NextResponse.json(response);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}