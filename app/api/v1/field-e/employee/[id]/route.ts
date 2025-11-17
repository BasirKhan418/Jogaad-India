import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import ConnectDb from "@/middleware/connectDb";
import Employee from "@/models/Employee";
import { getFieldExecutiveByEmail } from "@/repository/fieldexecutive/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value || "";
    
    // Verify token and check user type
    const isTokenValid = await verifyUserToken(token);
    if (!isTokenValid.success || isTokenValid.type !== "field-exec") {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    // Get field executive data
    const fieldExecData = await getFieldExecutiveByEmail(isTokenValid.email);
    if (!fieldExecData.success) {
      return NextResponse.json(
        { message: "Field executive not found", success: false },
        { status: 404 }
      );
    }

    // Connect to database
    await ConnectDb();

    // Find employee by ID and ensure it belongs to this field executive
    const employee = await Employee.findOne({
      _id: id,
      feid: fieldExecData.data._id,
      isActive: true
    }).populate('categoryid');

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found or access denied", success: false },
        { status: 404 }
      );
    }

    // Check if employee was created within the last 12 hours (editable window)
    const createdAt = new Date(employee.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 12) {
      return NextResponse.json(
        { 
          message: "Edit window expired. Employees can only be edited within 12 hours of creation.", 
          success: false 
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        message: "Employee retrieved successfully",
        success: true,
        employee: employee.toObject ? employee.toObject() : employee
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
