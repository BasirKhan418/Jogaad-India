import { NextResponse, NextRequest } from "next/server";
import { AdminSchemaZod } from "@/validator/admin/admin.auth";
import { createAdmin } from "@/repository/admin/admin.auth";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { sendWelcomeEmail } from "@/email/user/sendWelcome";
export const POST = async (request: NextRequest) => {
    try {
        const data = await request.json();
        console.log("Request Data:", data);
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        
        // Validate admin creation credential
        const adminCredential = process.env.ADMIN_CREATE_CREDENTIAL;
        if (!adminCredential) {
            return NextResponse.json({ message: "Admin creation is not configured", success: false }, { status: 503 });
        }
        
        //needs improvement in logic
        if (data.password === adminCredential) {
            const validateData = AdminSchemaZod.safeParse(data);
            if (!validateData.success) {
                return NextResponse.json({ message: "Invalid data", success: false }, { status: 400 });
            }
            const response = await createAdmin(validateData.data);
            if(response.success){
                sendWelcomeEmail({name: validateData.data.name, email: validateData.data.email, isAdmin: true});
            }
            return NextResponse.json(response);
        }
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json({ message: "Invalid crdential for creating admin", success: false }, { status: 401 });
        }
        const validateData = AdminSchemaZod.safeParse(data);
        if (!validateData.success) {
            return NextResponse.json({ message: "Invalid data", success: false }, { status: 400 });
        }
        const response = await createAdmin(validateData.data);
        return NextResponse.json(response);

    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}