import { NextResponse, NextRequest } from "next/server";
import { AdminSchemaZod } from "@/validator/admin/admin.auth";
import { createAdmin } from "@/repository/admin/admin.auth";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { sendWelcomeEmail } from "@/email/user/sendWelcome";

export const POST = async (request: NextRequest) => {
    try {
        const data = await request.json();
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        
        // Verify admin authentication
        const isTokenValid = await verifyUserToken(token);
        
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json({ 
                message: "Unauthorized. Admin access required.", 
                success: false 
            }, { status: 401 });
        }
        
        // Validate admin data
        const validateData = AdminSchemaZod.safeParse(data);
        if (!validateData.success) {
            return NextResponse.json({ 
                message: "Invalid data", 
                success: false 
            }, { status: 400 });
        }
        
        // Create admin account
        const response = await createAdmin(validateData.data);
        
        // Send welcome email on success
        if (response.success) {
            sendWelcomeEmail({
                name: validateData.data.name, 
                email: validateData.data.email, 
                isAdmin: true
            });
        }
        
        return NextResponse.json(response);

    } catch (error) {
        console.error("Admin creation error:", error);
        return NextResponse.json({ 
            message: "Internal Server Error", 
            success: false 
        }, { status: 500 });
    }
}
