import { NextResponse,NextRequest } from "next/server";
import { sendContactToAdmin } from "@/email/admin/contact";
export async function POST(request: NextRequest) {
    try{
        const data = await request.json();
        const result = await sendContactToAdmin(data);
        return NextResponse.json(result, {status:200});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}