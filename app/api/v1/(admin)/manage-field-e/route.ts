import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { FieldExecutiveSchemaZod } from "@/validator/fieldexecutive/field.validator";
import { createFieldExecutive, getAllFieldExecutives, updateFieldExecutive } from "@/repository/fieldexecutive/auth";

export const GET = async (request: NextRequest) => {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized - Admin access required", success: false }, 
                { status: 401 }
            );
        }
        
        const response = await getAllFieldExecutives();
        return NextResponse.json(response, { status: response.success ? 200 : 400 });
    }
    catch (error) {
        console.error("GET /api/v1/manage-field-e error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", success: false }, 
            { status: 500 }
        );
    }
}
// POST - Create new field executive
export const POST = async (request: Request) => {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized - Admin access required", success: false }, 
                { status: 401 }
            );
        }
        
        const reqBody = await request.json();
        const parseResult = FieldExecutiveSchemaZod.safeParse(reqBody);
        
        if (!parseResult.success) {
            return NextResponse.json(
                { 
                    message: "Invalid request data", 
                    success: false, 
                    errors: parseResult.error.format() 
                }, 
                { status: 400 }
            );
        }
        
        const response = await createFieldExecutive(parseResult.data);
        return NextResponse.json(response, { status: response.success ? 201 : 400 });
    }
    catch (error) {
        console.error("POST /api/v1/manage-field-e error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", success: false }, 
            { status: 500 }
        );
    }
}

// PUT - Update field executive (including soft delete via isActive)
export const PUT = async (request: Request) => {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized - Admin access required", success: false }, 
                { status: 401 }
            );
        }
        
        const reqBody = await request.json();
        
        // Validate that ID is provided
        if (!reqBody.id) {
            return NextResponse.json(
                { message: "Field Executive ID is required", success: false }, 
                { status: 400 }
            );
        }
        
        // Extract ID and validate remaining data
        const { id, ...updateData } = reqBody;
        const parseResult = FieldExecutiveSchemaZod.partial().safeParse(updateData);
        
        if (!parseResult.success) {
            return NextResponse.json(
                { 
                    message: "Invalid request data", 
                    success: false, 
                    errors: parseResult.error.format() 
                }, 
                { status: 400 }
            );
        }
        
        // Update targetDate if target is being updated
        const finalUpdateData = parseResult.data.target !== undefined
            ? { ...parseResult.data, targetDate: new Date() }
            : parseResult.data;
        
        const response = await updateFieldExecutive(id, finalUpdateData);
        return NextResponse.json(response, { status: response.success ? 200 : 400 });
    }
    catch (error) {
        console.error("PUT /api/v1/manage-field-e error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", success: false }, 
            { status: 500 }
        );
    }
}