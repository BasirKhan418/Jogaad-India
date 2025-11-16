import { NextResponse, NextRequest } from "next/server";
import { getEmployeeByEmail } from "@/repository/employee/employee.auth";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value || "";
        
        const verifyToken = await verifyUserToken(token);
        
        if (!verifyToken.success || verifyToken.type !== "employee") {
            return NextResponse.json({ 
                message: "Unauthorized - Invalid or missing token", 
                success: false 
            }, { status: 401 });
        }

        const email = verifyToken.email;
        
        if (!email) {
            return NextResponse.json({ 
                message: "Email not found in token", 
                success: false 
            }, { status: 400 });
        }

        const response = await getEmployeeByEmail(email);
        
        if (!response.success) {
            return NextResponse.json({ 
                message: response.message || "Employee not found", 
                success: false 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "Employee profile retrieved successfully", 
            employee: response.data,
            success: true 
        }, { status: 200 });

    } catch (error) {
        console.error('Employee profile fetch error:', error);
        return NextResponse.json({ 
            message: "Internal Server Error", 
            success: false 
        }, { status: 500 });
    }
}
