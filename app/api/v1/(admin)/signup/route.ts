import { NextResponse,NextRequest } from "next/server";
import { AdminSchemaZod } from "@/validator/admin/admin.auth";
import { createAdmin } from "@/repository/admin/admin.auth";
export const POST = async (request:NextRequest) => {
    try{
        const data = await request.json();
        const validateData = AdminSchemaZod.safeParse(data);
        if(!validateData.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const response = await createAdmin(validateData.data);
        return NextResponse.json(response);

    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}