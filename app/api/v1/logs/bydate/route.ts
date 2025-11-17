import { NextResponse, NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { fetchPaymentLogsByDate } from "@/utils/admin/paymentLogService";

export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { date } = body;

        if (!date) {
            return NextResponse.json({
                message: "Date is required",
                success: false
            }, { status: 400 });
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json({
                message: "Invalid date format. Use YYYY-MM-DD",
                success: false
            }, { status: 400 });
        }

        const result = await fetchPaymentLogsByDate(date);

        return NextResponse.json({
            message: "Payment logs fetched successfully",
            success: true,
            date: result.date,
            logs: result.logs,
            stats: result.stats
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching payment logs by date:", error);
        return NextResponse.json({
            message: error instanceof Error ? error.message : "Failed to fetch payment logs",
            success: false
        }, { status: 500 });
    }
}
