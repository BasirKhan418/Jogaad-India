import Razorpay from "razorpay";

export const CreateBookingRazorPay = async (amount: number, currency: string, receipt: string) => {
  try {
    // Check if Razorpay credentials are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials not configured");
      return { 
        message: "Payment gateway not configured. Please contact administrator.", 
        error: "Missing Razorpay credentials", 
        success: false, 
        order: null 
      };
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount,
      currency,
      receipt,
    };

    // Convert callback into a Promise
    const order = await new Promise((resolve, reject) => {
      instance.orders.create(options, (err, order) => {
        if (err) {
          console.error("Razorpay order creation error:", err);
          reject(err);
        } else {
          resolve(order);
        }
      });
    });

    return { message: "Order created successfully", order, success: true };
  } catch (error) {
    console.error("CreateEmployeeOrder error:", error);
    return { 
      message: "Error creating payment order", 
      error: error instanceof Error ? error.message : "Unknown error", 
      success: false, 
      order: null 
    };
  }
};
