import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { updateUserByEmail } from "@/repository/user/user.auth";


export async function PUT(request: NextRequest) {
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

    // Get update data from request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.name.trim()) {
      return NextResponse.json(
        { message: "Name is required", success: false },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (data.phone && !/^\d{10}$/.test(data.phone)) {
      return NextResponse.json(
        { message: "Phone number must be 10 digits", success: false },
        { status: 400 }
      );
    }

    // Validate pincode if provided
    if (data.pincode && !/^\d{6}$/.test(data.pincode)) {
      return NextResponse.json(
        { message: "Pincode must be 6 digits", success: false },
        { status: 400 }
      );
    }

    // Prepare update data (exclude email as it shouldn't be changed)
    const updateData = {
      name: data.name,
      address: data.address || '',
      phone: data.phone || '',
      pincode: data.pincode || '',
      img: data.img || '',
    };

    // Update user in database
    const result = await updateUserByEmail(isTokenValid.email, updateData);
    
    if (!result.success) {
      return NextResponse.json(
        { message: result.message || "Failed to update profile", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      success: true,
      data: result.user,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
