import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import ConnectDb from "@/middleware/connectDb";
import Admin from "@/models/Admin";

export const GET = async (request: NextRequest) => {
    try {
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
        
        // Connect to database
        await ConnectDb();
        
        // Fetch all admins (excluding sensitive data)
        const admins = await Admin.find({})
            .select('name email phone img isSuperAdmin createdAt updatedAt')
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json({
            success: true,
            data: admins,
            count: admins.length
        });

    } catch (error) {
        console.error("Fetch admins error:", error);
        return NextResponse.json({ 
            message: "Internal Server Error", 
            success: false 
        }, { status: 500 });
    }
}
