import { NextResponse } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { fetchTodayPaymentLogs } from "@/utils/admin/paymentLogService";

export async function GET() {
    try {
        const cookiesStore = await cookies();
        const userToken = cookiesStore.get("token")?.value || "";
        const isVerified = await verifyUserToken(userToken);
        
        if (!isVerified.success || isVerified.type !== "admin") {
            return NextResponse.json({ 
                message: "Unauthorized", 
                success: false 
            }, { status: 401 });
        }

        const result = await fetchTodayPaymentLogs();

        return NextResponse.json({
            message: "Payment logs fetched successfully",
            success: true,
            date: result.date,
            logs: result.logs,
            stats: result.stats
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching today's payment logs:", error);
        return NextResponse.json({
            message: error instanceof Error ? error.message : "Failed to fetch payment logs",
            success: false
        }, { status: 500 });
    }
}
