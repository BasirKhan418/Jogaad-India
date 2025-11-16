import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { getAllEmployees } from "@/repository/employee/employee.auth";

export const GET = async () => {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized", success: false },
                { status: 401 }
            );
        }

        const result = await getAllEmployees();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", success: false },
            { status: 500 }
        );
    }
};
