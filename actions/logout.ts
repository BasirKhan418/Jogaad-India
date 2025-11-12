"use server"
import { cookies } from "next/headers";

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return {message:"Logged out successfully", success:true};
}