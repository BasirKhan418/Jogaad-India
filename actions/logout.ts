"use server"
import { cookies } from "next/headers";

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    // Clean any auxiliary non-httpOnly cookies if added in future
    cookieStore.delete("role");
    return {message:"Logged out successfully", success:true};
}