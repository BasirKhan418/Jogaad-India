import { NextResponse, NextRequest } from "next/server";
import { verifyUserByEmail } from "@/repository/user/user.auth";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { verifyAdminByEmail } from "@/repository/admin/admin.auth";
import { getEmployeeByEmail } from "@/repository/employee/employee.auth";
import { getFieldExecutiveByEmail } from "@/repository/fieldexecutive/auth";
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        if (!isTokenValid.success) {
            return NextResponse.json({ message: "Invalid token", success: false }, { status: 401 });
        }
        let response;
        if (isTokenValid.type == "admin") {
            response = await verifyAdminByEmail(isTokenValid.email);
            if (response.success && response.data) {
                // Convert Mongoose document to plain object and add type
                const userData: any = response.data.toObject ? response.data.toObject() : {...response.data};
                userData.type = "admin";
                response.data = userData;
            }
            return NextResponse.json(response);
        }
        else if (isTokenValid.type == "user") {
            response = await verifyUserByEmail(isTokenValid.email);
            if (response.success && response.data) {
                // Convert Mongoose document to plain object and add type
                const userData: any = response.data.toObject ? response.data.toObject() : {...response.data};
                userData.type = "user";
                response.data = userData;
            }
            return NextResponse.json(response);
        }
        else if (isTokenValid.type == "employee") {
            response = await getEmployeeByEmail(isTokenValid.email);
            if (response.success && response.data) {
                // Convert Mongoose document to plain object and add type
                const userData: any = response.data.toObject ? response.data.toObject() : {...response.data};
                userData.type = "employee";
                response.data = userData;
            }
            return NextResponse.json(response);
        }
        else if (isTokenValid.type == "field-exec") {
            response = await getFieldExecutiveByEmail(isTokenValid.email);
            if (response.success && response.data) {
                // Convert Mongoose document to plain object and add type
                const userData: any = response.data.toObject ? response.data.toObject() : {...response.data};
                userData.type = "field-exec";
                response.data = userData;
            }
            return NextResponse.json(response);
        }
        return NextResponse.json({ message: "Invalid user type", success: false }, { status: 400 });
    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}