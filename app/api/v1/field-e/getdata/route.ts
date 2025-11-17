import { NextResponse, NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { getFieldExecutiveByEmail } from "@/repository/fieldexecutive/auth";
import { cookies } from "next/headers";


export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value || "";
        
        // Verify token and check user type
        const verifyToken = await verifyUserToken(token);
        
        if (!verifyToken.success) {
            return NextResponse.json({ 
                message: "Unauthorized - Invalid or missing token", 
                success: false 
            }, { status: 401 });
        }
        
        if (verifyToken.type !== "field-exec") {
            return NextResponse.json({ 
                message: "Unauthorized - Invalid user type", 
                success: false 
            }, { status: 403 });
        }

        const email = verifyToken.email;
        
        if (!email) {
            return NextResponse.json({ 
                message: "Email not found in token", 
                success: false 
            }, { status: 400 });
        }

        // Fetch field executive data from repository
        const response = await getFieldExecutiveByEmail(email);
        
        if (!response.success) {
            return NextResponse.json({ 
                message: response.message || "Field executive not found", 
                success: false 
            }, { status: 404 });
        }

        // Transform data if needed (handle mongoose document)
        const fieldExecData = response.data.toObject 
            ? response.data.toObject() 
            : response.data;

        return NextResponse.json({ 
            message: "Field executive data retrieved successfully", 
            data: fieldExecData,
            success: true 
        }, { status: 200 });

    } catch (error) {
        console.error("Field executive getdata error:", error);
        return NextResponse.json({ 
            message: "Internal Server Error", 
            success: false 
        }, { status: 500 });
    }
}
