export interface CreateUpiQrInput {
  type: "upi_qr";
  name: string;
  usage: "single_use" | "multiple_use";
  fixed_amount: boolean;
  payment_amount: number; // in paise
  description?: string;
  customer_id?: string;
  close_by?: number; // Unix timestamp (seconds)
  notes?: Record<string, string>;
}

export interface RazorpayQrResponse {
  id: string;
  entity: "qr_code";
  created_at: number;
  name: string;
  usage: string;
  type: string;
  image_url: string;
  payment_amount: number;
  status: "active" | "closed";
  description?: string;
  fixed_amount: boolean;
  payments_amount_received: number;
  payments_count_received: number;
  notes?: Record<string, string>;
  customer_id?: string;
  close_by?: number;
}
