import { NextResponse, NextRequest } from "next/server";
import { verifyUserByEmail } from "@/repository/user/user.auth";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { verifyAdminByEmail } from "@/repository/admin/admin.auth";
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
            return NextResponse.json(response);
        }
        else if (isTokenValid.type == "user") {
            response = await verifyUserByEmail(isTokenValid.email);
            return NextResponse.json(response);
        }
        return NextResponse.json({ message: "Invalid user type", success: false }, { status: 400 });
    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}