import { NextResponse,NextRequest } from "next/server";


export const GET = async (request:NextRequest) => {
    try{
        return NextResponse.json({message:"Not Implemented",success:false}, {status:501});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}
export const POST = async (request:NextRequest) => {
    try{
        return NextResponse.json({message:"Not Implemented",success:false}, {status:501});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}