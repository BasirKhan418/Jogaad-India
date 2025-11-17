import { NextResponse,NextRequest } from "next/server";
import {createUser,updateUserByEmail,verifyUserByEmail } from "@/repository/user/user.auth";
import { sendWelcomeEmail } from "@/email/user/sendWelcome";
import { userSchema,userUpdateSchema } from "@/validator/user/user.auth";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";

//get user data
export async function GET(request:NextRequest) {
    try{
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="user"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const user = await verifyUserByEmail(isTokenValid.email);
        if(!user.success){
            return NextResponse.json({message:"User not found",success:false}, {status:404});
        }
        return NextResponse.json({message:"User data fetched successfully",data:user.data,success:true}, {status:200});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}

export async function POST(request:NextRequest) {
    try{
         const data = await request.json();
        const validatedata = userSchema.safeParse(data);
        if(!validatedata.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        
        const response = await createUser(validatedata.data);
        if(response.success){
            sendWelcomeEmail({name: validatedata.data.name, email: validatedata.data.email, isAdmin: false});
        }   
        return NextResponse.json(response);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}

//update endpoint
export async function PUT(request:NextRequest) {
    try{
         const data = await request.json();
        const validatedata = userUpdateSchema.safeParse(data);
        if(!validatedata.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const response = await updateUserByEmail(data.email, data);
        return NextResponse.json(response);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}