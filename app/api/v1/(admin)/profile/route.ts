import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { verifyAdminByEmail } from "@/repository/admin/admin.auth";

export const GET = async (request: NextRequest) => {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        
        if (!token) {
            return NextResponse.json({
                message: "No token provided",
                success: false
            }, { status: 401 });
        }

        const tokenVerification = await verifyUserToken(token);
        
        if (!tokenVerification.success || tokenVerification.type !== "admin") {
            return NextResponse.json({
                message: "Invalid or expired token",
                success: false
            }, { status: 401 });
        }

        // Get admin data using the email from token
        const adminData = await verifyAdminByEmail(tokenVerification.email);
        
        if (!adminData.success) {
            return NextResponse.json({
                message: "Admin not found",
                success: false
            }, { status: 404 });
        }

        // Convert Mongoose document to plain object and remove sensitive data
        const adminObj = adminData.data.toObject ? adminData.data.toObject() : adminData.data;
        const { password, ...safeAdminData } = adminObj;
        
        return NextResponse.json({
            message: "Admin data retrieved successfully",
            success: true,
            data: safeAdminData
        });
        
    } catch (error) {
        console.error("Get admin data error:", error);
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });
    }
};