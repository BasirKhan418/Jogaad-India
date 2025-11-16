import { NextResponse ,NextRequest} from "next/server";
import { loginFieldExecutive } from "@/repository/fieldexecutive/auth";
import { FieldExecutiveLoginSchema } from "@/validator/fieldexecutive/field.validator";
export const POST = async (request:Request) => {
    try{
        const reqBody = await request.json();
        const parseResult = FieldExecutiveLoginSchema.safeParse(reqBody);
        if(!parseResult.success){
            return NextResponse.json({message:"Invalid request data",success:false,errors:parseResult.error.format()}, {status:400});
        }
        const response = await loginFieldExecutive(reqBody.email);
        return NextResponse.json(response);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}