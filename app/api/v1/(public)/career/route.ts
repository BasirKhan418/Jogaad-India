import { NextResponse } from "next/server";
import { getActiveCareers } from "@/repository/admin/carrer";

/**
 * GET /api/v1/career
 * Public endpoint to fetch all active career opportunities
 * Only returns careers that are active and not past their application deadline
 */
export async function GET() {
    try{
        const result = await getActiveCareers();
        return NextResponse.json(result);
    }
    catch(error){
        console.error("Error in public career GET:", error);
        return NextResponse.json({message:"Internal Server Error", success: false}, {status:500});
    }
}