import { NextResponse, NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import ConnectDb from "@/middleware/connectDb";
import Employee from "@/models/Employee";

export const POST = async (request: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";

    // Verify token
    const isTokenValid = await verifyUserToken(token);
    if (!isTokenValid.success || isTokenValid.type !== "employee") {
      return NextResponse.json(
        { message: "Invalid token", success: false },
        { status: 401 }
      );
    }

    // Parse request body
    const { isActive } = await request.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { message: "isActive must be a boolean value", success: false },
        { status: 400 }
      );
    }

    // Connect to database
    await ConnectDb();

    // Update employee availability
    const updatedEmployee = await Employee.findOneAndUpdate(
      { email: isTokenValid.email },
      { isActive },
      { new: true }
    );

    if (!updatedEmployee) {
      return NextResponse.json(
        { message: "Employee not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Availability updated successfully. You are now ${isActive ? "available" : "unavailable"} for bookings.`,
      success: true,
      data: {
        isActive: updatedEmployee.isActive,
      },
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    return NextResponse.json(
      { 
        message: "Failed to update availability", 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
};
