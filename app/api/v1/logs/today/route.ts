import { NextResponse } from "next/server";
import { fetchLogFromS3 } from "@/utils/s3Logger";

export async function GET() {
  const now = new Date();

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
