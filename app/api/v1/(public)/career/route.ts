import { NextResponse } from "next/server";
import { getAllCareers } from "@/repository/admin/carrer";

export async function GET() {
    try{
        const result = await getAllCareers();
        return NextResponse.json(result);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",error}, {status:500});
    }
}