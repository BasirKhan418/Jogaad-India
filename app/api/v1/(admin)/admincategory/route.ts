import { NextResponse,NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { CategorySchemaZod } from "@/validator/admin/category";
import { createCategory,updateCategoryById } from "@/repository/admin/category";

export const POST = async (request:NextRequest) => {
    try{
        const data = await request.json();
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="admin"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const validateData = CategorySchemaZod.safeParse(data);
        if(!validateData.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const result = await createCategory(validateData.data);
        return NextResponse.json(result);

    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}

export const PUT = async (request:NextRequest) => {
    try{
        const data = await request.json();
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="admin"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const validateData = CategorySchemaZod.safeParse(data);
        if(!validateData.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const result = await updateCategoryById(data.id, validateData.data);
        return NextResponse.json(result);

    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}