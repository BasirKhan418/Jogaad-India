import Razorpay from "razorpay";

export const RefundBookingPayment = async (
  payment_id: string,
  amount?: number // optional → partial refund
) => {
  try {
    // Check Razorpay config
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials not configured");
      return {
        message: "Payment gateway not configured. Please contact administrator.",
        error: "Missing Razorpay credentials",
        success: false,
        refund: null,
      };
    }

    // Razorpay Instance
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Build refund payload
    const refundOptions: any = {};
    if (amount) refundOptions.amount = amount; // amount in paise

    // Convert callback to Promise
    const refund = await new Promise((resolve, reject) => {
      instance.payments.refund(payment_id, refundOptions, (err, refundData) => {
        if (err) {
          console.error("Refund error:", err);
          reject(err);
        } else {
          resolve(refundData);
        }
      });
    });

    return {
      message: "Refund processed successfully",
      refund,
      success: true,
    };
  } catch (error) {
    console.error("RefundEmployeePayment error:", error);
    return {
      message: "Failed to process refund",
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
      refund: null,
    };
  }
};
