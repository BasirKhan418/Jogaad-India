import { NextResponse,NextRequest } from "next/server";
import {createUser,updateUserByEmail } from "@/repository/user/user.auth";
import { sendWelcomeEmail } from "@/email/user/sendWelcome";
import { userSchema,userUpdateSchema } from "@/validator/user/user.auth";
export async function POST(request:NextRequest) {
    try{
         const data = await request.json();
        const validatedata = userSchema.safeParse(data);
        if(!validatedata.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        
        const response = await createUser(validatedata.data);
        if(response.success){
            await sendWelcomeEmail({name: validatedata.data.name, email: validatedata.data.email, isAdmin: false});
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