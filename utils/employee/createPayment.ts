import Razorpay from "razorpay";

export const CreateEmployeeOrder = async (amount: number, currency: string, receipt: string) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
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
          reject(err);
        } else {
          resolve(order);
        }
      });
    });

    return { message: "Order created successfully", order, success: true };
  } catch (error) {
    return { message: "Error creating payment order", error, success: false, order: null };
  }
};
