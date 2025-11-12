import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { verifyAdminByEmail, updateAdminByEmail } from "@/repository/admin/admin.auth";

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

export const PUT = async (request: NextRequest) => {
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

        const body = await request.json();
        const { name, phone, img } = body;

        // Validation
        if (!name || !name.trim()) {
            return NextResponse.json({
                message: "Name is required",
                success: false
            }, { status: 400 });
        }

        if (phone && !/^\d{10}$/.test(phone)) {
            return NextResponse.json({
                message: "Phone number must be 10 digits",
                success: false
            }, { status: 400 });
        }

        // Update admin data
        const updateData: any = {
            name: name.trim(),
        };

        if (phone) {
            updateData.phone = phone;
        }

        if (img) {
            updateData.img = img;
        }

        const result = await updateAdminByEmail(tokenVerification.email, updateData);
        
        if (!result.success) {
            return NextResponse.json({
                message: result.message || "Failed to update profile",
                success: false
            }, { status: 400 });
        }

        // Convert Mongoose document to plain object and remove sensitive data
        const adminObj = result.admin.toObject ? result.admin.toObject() : result.admin;
        const { password, ...safeAdminData } = adminObj;
        
        return NextResponse.json({
            message: "Profile updated successfully",
            success: true,
            data: safeAdminData
        });
        
    } catch (error) {
        console.error("Update admin profile error:", error);
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });
    }
};