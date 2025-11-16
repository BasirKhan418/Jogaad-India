import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { FieldExecutiveSchemaZod } from "@/validator/fieldexecutive/field.validator";
import { createFieldExecutive } from "@/repository/fieldexecutive/auth";
import { getAllFieldExecutives } from "@/repository/fieldexecutive/auth";
import { updateFieldExecutive } from "@/repository/fieldexecutive/auth";
export const GET = async (request: NextRequest) => {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json({ message: "Invalid token", success: false }, { status: 401 });
        }
        const response = await getAllFieldExecutives();
        return NextResponse.json(response);
    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}
export const POST = async (request: Request) => {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json({ message: "Invalid token", success: false }, { status: 401 });
        }
        const reqBody = await request.json();
        const parseResult = FieldExecutiveSchemaZod.safeParse(reqBody);
        if (!parseResult.success) {
            return NextResponse.json({ message: "Invalid request data", success: false, errors: parseResult.error.format() }, { status: 400 });
        }
        const response = await createFieldExecutive(reqBody);
        return NextResponse.json(response);

    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}

export const PUT = async (request: Request) => {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json({ message: "Invalid token", success: false }, { status: 401 });
        }
        const reqBody = await request.json();
        const parseResult = FieldExecutiveSchemaZod.partial().safeParse(reqBody);
        if (!parseResult.success) {
            return NextResponse.json({ message: "Invalid request data", success: false, errors: parseResult.error.format() }, { status: 400 });
        }
        const response = await updateFieldExecutive(reqBody.id, reqBody);
        return NextResponse.json(response);
    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}