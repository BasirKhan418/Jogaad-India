import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { getUserByEmail } from "@/repository/user/user.auth";

export async function GET(request: NextRequest) {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value || "";
    
    console.log("Profile API - Token exists:", !!token);
    
    const isTokenValid = await verifyUserToken(token);
    
    console.log("Profile API - Token valid:", isTokenValid.success, "Type:", isTokenValid.type);
    
    if (!isTokenValid.success || isTokenValid.type !== "user") {
      return NextResponse.json(
        { message: "Unauthorized - Invalid token", success: false },
        { status: 401 }
      );
    }

    console.log("Profile API - Fetching user for email:", isTokenValid.email);
    const userData = await getUserByEmail(isTokenValid.email);
    
    console.log("Profile API - getUserByEmail result:", userData.success);
    
    if (!userData.success) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Convert mongoose document to plain object
    const userInfo = userData.data.toObject ? userData.data.toObject() : userData.data;
    
    console.log("Profile API - Returning user data successfully");
    
    return NextResponse.json({
      message: "User profile fetched successfully",
      success: true,
      data: userInfo,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
