import { NextResponse,NextRequest } from "next/server";
import { updateFees,createFees,getFees } from "@/repository/admin/fees";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { FeesSchemaZod } from "@/validator/admin/fees";
//get fees endpoint
export const GET = async (request:NextRequest) => {
    try{
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="admin"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const result = await getFees();
        return NextResponse.json(result);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}
//create fees endpoint
export const POST = async (request:NextRequest) => {
    try{
        const data = await request.json();
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="admin"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const fees = await getFees();
        if(fees.success && fees.data){
            return NextResponse.json({message:"Fees already exists",success:false}, {status:400});
        }
        const validateData = FeesSchemaZod.safeParse(data);
        if(!validateData.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const result = await createFees(data);
        return NextResponse.json(result);

    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}
//update fees endpoint
export const PUT = async (request:NextRequest) => {
    try{
        const data = await request.json();
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="admin"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const validateData = FeesSchemaZod.safeParse(data);
        if(!validateData.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const result = await updateFees(data.id,data);
        return NextResponse.json(result);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}