import { NextResponse, NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { careerSchema } from "@/validator/admin/career";
import { 
    createCareer, 
    updateCareer, 
    getAllCareers, 
    getCareerById, 
    deleteCareer 
} from "@/repository/admin/carrer";
import { verifyAdminByEmail } from "@/repository/admin/admin.auth";

/**
 * GET /api/v1/admin/career
 * Fetches all careers for admin dashboard
 * Optional query params: id - fetch single career by ID
 */
export const GET = async (request: NextRequest) => {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json({ message: "Invalid token", success: false }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const careerId = searchParams.get('id');

        // Fetch single career by ID
        if (careerId) {
            const result = await getCareerById(careerId);
            if (!result.success) {
                return NextResponse.json(result, { status: 404 });
            }
            return NextResponse.json(result);
        }

        // Fetch all careers
        const result = await getAllCareers();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in admin career GET:", error);
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}

/**
 * POST /api/v1/admin/career
 * Creates a new career entry
 */
export const POST = async (request: NextRequest) => {
    try {
        const data = await request.json();
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json({ message: "Invalid token", success: false }, { status: 401 });
        }

        const isAdmin = await verifyAdminByEmail(isTokenValid.email);
        if (!isAdmin || !isAdmin.success) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 403 });
        }

        // Validate input data
        const validateData = careerSchema.safeParse(data);
        if (!validateData.success) {
            return NextResponse.json({ 
                message: "Invalid data", 
                errors: validateData.error.format(),
                success: false 
            }, { status: 400 });
        }

        // Add author information
        const careerData = {
            ...validateData.data,
            author: isAdmin.data._id,
            lastEditedAuthor: isAdmin.data._id
        };

        const result = await createCareer(careerData);
        
        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error in admin career POST:", error);
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}

/**
 * PUT /api/v1/admin/career
 * Updates an existing career entry
 * Required query params: id - career ID to update
 */
export const PUT = async (request: NextRequest) => {
    try {
        const data = await request.json();
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json({ message: "Invalid token", success: false }, { status: 401 });
        }

        const isAdmin = await verifyAdminByEmail(isTokenValid.email);
        if (!isAdmin || !isAdmin.success) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const careerId = searchParams.get('id');

        if (!careerId) {
            return NextResponse.json({ 
                message: "Career ID is required", 
                success: false 
            }, { status: 400 });
        }

        // Validate input data (partial update allowed)
        const validateData = careerSchema.partial().safeParse(data);
        if (!validateData.success) {
            return NextResponse.json({ 
                message: "Invalid data", 
                errors: validateData.error.format(),
                success: false 
            }, { status: 400 });
        }

        // Update with lastEditedAuthor
        const careerData = {
            ...validateData.data,
            lastEditedAuthor: isAdmin.data._id
        };

        const result = await updateCareer(careerId, careerData);
        
        if (!result.success) {
            return NextResponse.json(result, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in admin career PUT:", error);
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}

/**
 * DELETE /api/v1/admin/career
 * Deletes a career entry
 * Required query params: id - career ID to delete
 */
export const DELETE = async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const careerId = searchParams.get('id');

        if (!careerId) {
            return NextResponse.json({ 
                message: "Career ID is required", 
                success: false 
            }, { status: 400 });
        }

        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        
        if (!isTokenValid.success || isTokenValid.type !== "admin") {
            return NextResponse.json({ message: "Invalid token", success: false }, { status: 401 });
        }

        const isAdmin = await verifyAdminByEmail(isTokenValid.email);
        if (!isAdmin || !isAdmin.success) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 403 });
        }

        const result = await deleteCareer(careerId);
        
        if (!result.success) {
            return NextResponse.json(result, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in admin career DELETE:", error);
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}
