import { getPaymentLogsByDate, getTodayPaymentLogs, PaymentLog } from "@/repository/admin/paymentLogs";

export interface PaymentLogStats {
  totalLogs: number;
  capturedPayments: number;
  failedPayments: number;
  errors: number;
  infoLogs: number;
}

export interface PaymentLogResponse {
  date: string;
  logs: PaymentLog[];
  stats: PaymentLogStats;
  success: boolean;
}

export async function fetchPaymentLogsByDate(date: string): Promise<PaymentLogResponse> {
  try {
    // Validate date format
    if (!isValidDate(date)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    const logs = await getPaymentLogsByDate(date);
    const stats = calculateLogStats(logs);

    return {
      date,
      logs,
      stats,
      success: true
    };
  } catch (error) {
    console.error("Error in fetchPaymentLogsByDate:", error);
    throw error;
  }
}

export async function fetchTodayPaymentLogs(): Promise<PaymentLogResponse> {
  try {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const today = `${yyyy}-${mm}-${dd}`;

    const logs = await getTodayPaymentLogs();
    const stats = calculateLogStats(logs);

    return {
      date: today,
      logs,
      stats,
      success: true
    };
  } catch (error) {
    console.error("Error in fetchTodayPaymentLogs:", error);
    throw error;
  }
}

function calculateLogStats(logs: PaymentLog[]): PaymentLogStats {
  return {
    totalLogs: logs.length,
    capturedPayments: logs.filter(log => log.type === "payment.captured").length,
    failedPayments: logs.filter(log => log.type === "payment.failed").length,
    errors: logs.filter(log => log.type === "error").length,
    infoLogs: logs.filter(log => log.type === "info").length
  };
}

function isValidDate(date: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    return false;
  }

  const [year, month, day] = date.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
}

export function extractPaymentDetails(log: PaymentLog): {
  paymentId?: string;
  amount?: number;
  currency?: string;
  orderId?: string;
  status?: string;
} | null {
  try {
    // Try to parse JSON from the message
    const jsonMatch = log.message.match(/\{.*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return {
        paymentId: data.id,
        amount: data.amount ? data.amount / 100 : undefined, // Convert paise to rupees
        currency: data.currency,
        orderId: data.order_id,
        status: data.status
      };
    }
  } catch (error) {
    return null;
  }
  return null;
}
