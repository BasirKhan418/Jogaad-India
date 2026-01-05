import Razorpay from "razorpay";
import { CreateUpiQrInput, RazorpayQrResponse } from "./Qrtypes";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});
export const createUpiQrCode = async (
  params: CreateUpiQrInput
): Promise<RazorpayQrResponse> => {
  try {
    const qrCode = await razorpay.qrCode.create(params);

    return qrCode as RazorpayQrResponse;
  } catch (error: any) {
    console.error("Razorpay QR creation failed:", error);

    throw {
      success: false,
      message: error?.error?.description || "Failed to create UPI QR code",
      statusCode: error?.statusCode || 500,
    };
  }
};
