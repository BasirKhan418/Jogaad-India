import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { getUserByEmail } from "@/repository/user/user.auth";

export async function GET(request: NextRequest) {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value || "";
    
    // Verify token
    const isTokenValid = await verifyUserToken(token);
    
    if (!isTokenValid.success || isTokenValid.type !== "user") {
      return NextResponse.json(
        { message: "Unauthorized - Invalid token", success: false },
        { status: 401 }
      );
    }

    const userData = await getUserByEmail(isTokenValid.email);
    
    if (!userData.success) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const { ...userInfo } = userData.data;
    
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
