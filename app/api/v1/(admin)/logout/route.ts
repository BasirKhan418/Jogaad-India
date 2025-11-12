import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export const POST = async (request: NextRequest) => {
    try {
        const cookiesStore = await cookies();
        
        cookiesStore.set("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(0), 
        });
        
        return NextResponse.json({
            message: "Logged out successfully",
            success: true
        });
        
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });
    }
};