import { NextResponse } from "next/server";
import { fetchLogFromS3 } from "@/utils/s3Logger";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";

export async function GET() {
    const now = new Date();
    const cookesStore = await cookies();
    const userToken = cookesStore.get("token")?.value || "";
    const isVerified = await verifyUserToken(userToken);
    
    if (!isVerified || isVerified.type !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    const date = `${yyyy}-${mm}-${dd}`;

    const logs = await fetchLogFromS3(date);

    return NextResponse.json({
        date,
        logs: logs || "No logs found for today."
    });
}
