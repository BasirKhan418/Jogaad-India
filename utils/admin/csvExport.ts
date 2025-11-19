import { Booking } from "@/components/admin/bookings/types";

export interface CSVField<T> {
  key: string;
  header: string;
  getValue: (item: T) => string | number | null | undefined;
}

export const BOOKING_CSV_FIELDS: CSVField<Booking>[] = [
  { key: "bookingId", header: "Booking ID", getValue: (booking) => booking._id },
  { key: "orderId", header: "Order ID", getValue: (booking) => booking.orderid },
  { key: "status", header: "Status", getValue: (booking) => booking.status },
  { key: "bookingDate", header: "Booking Date", getValue: (booking) => booking.bookingDate },
  { key: "initialAmount", header: "Initial Amount", getValue: (booking) => booking.intialamount },
  { key: "bookingAmount", header: "Booking Amount", getValue: (booking) => booking.bookingAmount || "" },
  { key: "paymentId", header: "Payment ID", getValue: (booking) => booking.paymentid || "" },
  { key: "paymentStatus", header: "Payment Status", getValue: (booking) => booking.paymentStatus || "" },
  { key: "initialPaymentStatus", header: "Initial Payment Status", getValue: (booking) => booking.intialPaymentStatus || "" },
  { key: "refundStatus", header: "Refund Status", getValue: (booking) => booking.refundStatus || "" },
  { key: "refundAmount", header: "Refund Amount", getValue: (booking) => booking.refundAmount || "" },
  { key: "refundDate", header: "Refund Date", getValue: (booking) => booking.refundDate || "" },
  { key: "refundId", header: "Refund ID", getValue: (booking) => booking.refundid || "" },
  { key: "feedback", header: "Feedback", getValue: (booking) => booking.feedback || "" },
  { key: "rating", header: "Rating", getValue: (booking) => booking.rating || "" },
  { key: "createdAt", header: "Created At", getValue: (booking) => booking.createdAt },
  { key: "updatedAt", header: "Updated At", getValue: (booking) => booking.updatedAt },
  { key: "customerName", header: "Customer Name", getValue: (booking) => booking.userid?.name || "" },
  { key: "customerEmail", header: "Customer Email", getValue: (booking) => booking.userid?.email || "" },
  { key: "customerPhone", header: "Customer Phone", getValue: (booking) => booking.userid?.phone || "" },
  { key: "customerAddress", header: "Customer Address", getValue: (booking) => booking.userid?.address || "" },
  { key: "customerPincode", header: "Customer Pincode", getValue: (booking) => booking.userid?.pincode || "" },
  { key: "serviceName", header: "Service Name", getValue: (booking) => booking.categoryid?.categoryName || "" },
  { key: "serviceType", header: "Service Type", getValue: (booking) => booking.categoryid?.categoryType || "" },
  { key: "serviceUnit", header: "Service Unit", getValue: (booking) => booking.categoryid?.categoryUnit || "" },
  { key: "serviceDescription", header: "Service Description", getValue: (booking) => booking.categoryid?.categoryDescription || "" },
  { key: "providerName", header: "Provider Name", getValue: (booking) => booking.employeeid?.name || "" },
  { key: "providerEmail", header: "Provider Email", getValue: (booking) => booking.employeeid?.email || "" },
  { key: "providerPhone", header: "Provider Phone", getValue: (booking) => booking.employeeid?.phone || "" },
];


export function escapeCsvField(field: string | number | null | undefined): string {
  const stringField = String(field || "");
  if (stringField.includes('"') || stringField.includes(',') || stringField.includes('\n') || stringField.includes('\r')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}


export function generateCSV<T>(items: T[], fields: CSVField<T>[]): string {
  if (!items || items.length === 0) {
    return fields.map(field => field.header).join(",");
  }

  const headers = fields.map(field => field.header).join(",");
  const rows = items.map(item => 
    fields.map(field => escapeCsvField(field.getValue(item))).join(",")
  );

  return [headers, ...rows].join("\n");
}


export function downloadCSV(csvContent: string, filename: string): void {
  try {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (!link.download) {
      throw new Error("Browser does not support file downloads");
    }

    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download CSV:", error);
    throw new Error("Failed to download CSV file");
  }
}



export function generateExportFilename(prefix: string, extension: string = "csv"): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}_export_${timestamp}.${extension}`;
}