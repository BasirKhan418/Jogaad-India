import { NextResponse,NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { updateFieldExecutive } from "@/repository/fieldexecutive/auth";
import { FieldExecutiveSchemaZod } from "@/validator/fieldexecutive/field.validator";
export const PUT = async (request:Request) => {
    try{
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success || isTokenValid.type !== "field-exec"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const reqBody = await request.json();
        const parseResult = FieldExecutiveSchemaZod.partial().safeParse(reqBody);
        if(!parseResult.success){
            return NextResponse.json({message:"Invalid request data",success:false,errors:parseResult.error.format()}, {status:400});
        }
        const response = await updateFieldExecutive(reqBody.id, reqBody);
        return NextResponse.json(response);

    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}