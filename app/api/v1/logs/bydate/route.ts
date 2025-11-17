import { NextResponse, NextRequest } from "next/server";
import { fetchLogFromS3 } from "@/utils/s3Logger";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
export async function POST(request: NextRequest) {
    const { date } = await request.json(); // expected format: YYYY-MM-DD
    const cookesStore = await cookies();
    const userToken = cookesStore.get("token")?.value || "";
    const isVerified = await verifyUserToken(userToken);
    
    if (!isVerified || isVerified.type !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json(
            { error: "Invalid date format. Use YYYY-MM-DD." },
            { status: 400 }
        );
    }

    const logs = await fetchLogFromS3(date);

    return NextResponse.json({
        date,
        logs: logs || "No logs found for this date."
    });
}
