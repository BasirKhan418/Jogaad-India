import { fetchLogFromS3 } from "@/utils/s3Logger";

export interface PaymentLog {
  timestamp: string;
  message: string;
  type: "payment.captured" | "payment.failed" | "info" | "error";
}

export async function getPaymentLogsByDate(date: string): Promise<PaymentLog[]> {
  try {
    const rawLogs = await fetchLogFromS3(date);
    if (!rawLogs) {
      return [];
    }

    return parseRawLogs(rawLogs);
  } catch (error) {
    console.error("Error fetching payment logs:", error);
    throw new Error("Failed to fetch payment logs");
  }
}

export async function getTodayPaymentLogs(): Promise<PaymentLog[]> {
  try {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const today = `${yyyy}-${mm}-${dd}`;

    return await getPaymentLogsByDate(today);
  } catch (error) {
    console.error("Error fetching today's payment logs:", error);
    throw new Error("Failed to fetch today's payment logs");
  }
}


function parseRawLogs(rawLogs: string): PaymentLog[] {
  const lines = rawLogs.split("\n").filter(line => line.trim() !== "");
  
  return lines.map(line => {
    try {
      const timestampMatch = line.match(/\[(.*?)\]/);
      const timestamp = timestampMatch ? timestampMatch[1] : "";
      
      const message = line.substring(line.indexOf("]") + 1).trim();
      
      let type: PaymentLog["type"] = "info";
      if (message.includes("Payment captured")) {
        type = "payment.captured";
      } else if (message.includes("Payment failed")) {
        type = "payment.failed";
      } else if (message.toLowerCase().includes("error")) {
        type = "error";
      }

      return {
        timestamp,
        message,
        type
      };
    } catch (error) {
      return {
        timestamp: "",
        message: line,
        type: "info"
      };
    }
  });
}
