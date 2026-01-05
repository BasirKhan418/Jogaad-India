import ConnectDb from "@/middleware/connectDb";
import setConnectionRedis from "@/middleware/connectRedis";
import FieldExecutive from "@/models/FieldExecutive";
import { FieldExecutiveType } from "@/validator/fieldexecutive/field.validator";
import { sendFieldExecutiveWelcomeEmail } from "@/email/field-executive/welcome";
import { sendFieldExecutiveOtp } from "@/email/field-executive/sendotp";
import jwt from "jsonwebtoken";
import { createUpiQrCode } from "../razorpay/createUpiQrCode";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});
// Create field executive
async function getOrCreateRazorpayCustomer({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}) {
  const redisClient = setConnectionRedis();
  const redisKey = `rzp_customer_${email}`;

  const cached = await redisClient.get(redisKey);
  if (cached) return JSON.parse(cached);

  const customer = await razorpay.customers.create({
    name,
    email,
    contact: phone,
  });

  await redisClient.set(redisKey, JSON.stringify(customer), "EX", 24 * 60 * 60);
  return customer;
}
async function generateFieldExecutiveQR({
  name,
  email,
  phone,
  amount,
  receipt,
}: {
  name: string;
  email: string;
  phone: string;
  amount: number;
  receipt: string;
}) {
  const redisClient = setConnectionRedis();

  const existing = await redisClient.get(`fe_${email}_order`);
  if (existing) return JSON.parse(existing);

  const customer = await getOrCreateRazorpayCustomer({ name, email, phone });

  const closeBy = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

  const qr = await createUpiQrCode({
    type: "upi_qr",
    name: "Jogaad India",
    usage: "single_use",
    fixed_amount: true,
    payment_amount: amount,
    description: "For Field Executive Registration Fees - Jogaad India",
    customer_id: customer.id,
    close_by: closeBy,
    notes: { receipt },
  });

  const order = {
    id: qr.id,
    img: qr.image_url,
    customerId: qr.customer_id,
    amount: qr.payment_amount,
    receipt,
  };

  await redisClient.set(`fe_${email}_order`, JSON.stringify(order), "EX", 24 * 60 * 60);

  return order;
}

export const createFieldExecutive = async (data: FieldExecutiveType) => {
  try {
    await ConnectDb();

    const exists = await FieldExecutive.findOne({ email: data.email });
    if (exists) {
      return {
        success: false,
        message: "Field Executive with this email already exists",
      };
    }

    const amount = parseInt(process.env.EMP_FEES || "39") * 100;

    /** GENERATE QR */
    const order = await generateFieldExecutiveQR({
      name: data.name,
      email: data.email,
      phone: data.phone,
      amount,
      receipt: `fe_reg_${data.email}`,
    });

    /** CREATE FIELD EXEC */
    const newFieldExecutive = new FieldExecutive({
      ...data,
      isActive: false,
      isPaid: false,
      orderid: order.id,
      qrcodeimg: order.img,
      customerid: order.customerId,
    });

    await newFieldExecutive.save();

    /** SEND PAYMENT LINK */
    await sendFieldExecutiveWelcomeEmail({
      name: data.name,
      email: data.email,
      link: `${process.env.EMP_PAYMENT_URL}?id=${newFieldExecutive._id}`,
    });

    return {
      success: true,
      message: "Field Executive created successfully",
      data: newFieldExecutive,
    };
  } catch (error) {
    console.error("CREATE FE ERROR:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

// Get all field executives
export const getAllFieldExecutives = async () => {
    try {
        await ConnectDb();
        const fieldExecutives = await FieldExecutive.find().sort({ createdAt: -1 });
        return { message: "Field Executives fetched successfully", data: fieldExecutives, success: true };
    }
    catch (error) {
        console.error("Error fetching field executives:", error);
        return { message: "Internal Server Error", success: false };
    }
}

// Update field executive
export const updateFieldExecutive = async (id: string, updateData: Partial<FieldExecutiveType>) => {
    try {
        await ConnectDb();
        const updatedFieldExecutive = await FieldExecutive.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedFieldExecutive) {
            return { message: "Field Executive not found", success: false };
        }
        return { message: "Field Executive updated successfully", data: updatedFieldExecutive, success: true };
    }
    catch (error) {
        console.error("Error updating field executive:", error);
        // Handle duplicate email gracefully
        if (typeof error === 'object' && error && (error as any).code === 11000) {
            const keyPattern = (error as any).keyPattern || {};
            if (keyPattern.email) {
                return { message: "Email already in use", success: false };
            }
            return { message: "Duplicate key error", success: false };
        }
        return { message: "Internal Server Error", success: false };
    }
}

// Get field executive by ID
export const getFieldExecutiveById = async (id: string) => {
    try {
        await ConnectDb();
        const fieldExecutive = await FieldExecutive.findById(id);
        if (!fieldExecutive) {
            return { message: "Field Executive not found", success: false };
        }
        return { message: "Field Executive fetched successfully", data: fieldExecutive, success: true };
    }
    catch (error) {
        console.error("Error fetching field executive:", error);
        return { message: "Internal Server Error", success: false };
    }
}
// Login field executive
export const loginFieldExecutive = async (email: string) => {
    try {
        const redisClient = setConnectionRedis();
        await ConnectDb();
        const fieldExecutive = await FieldExecutive.findOne({ email, isActive: true });
        if (!fieldExecutive) {
            return { message: "Field Executive not found or inactive", success: false };
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.set(`field-exec-otp-${email}`, otp, "EX", 300);
        await sendFieldExecutiveOtp({ email, otp });
        return { message: "OTP sent successfully", success: true };
    }
    catch (error) {
        console.error("Error logging in field executive:", error);
        return { message: "Internal Server Error", success: false };
    }
}

// Verify field executive otp 
export const verifyFieldExecutiveOtp = async (email: string, otp: string) => {
    try {
        await ConnectDb();
        const redisClient = setConnectionRedis();
        const storedOtp = await redisClient.get(`field-exec-otp-${email}`);
        if (storedOtp !== otp) {
            return { message: "Invalid OTP", success: false };
        }
        await redisClient.del(`field-exec-otp-${email}`);
        const token = jwt.sign({ email, type: "field-exec" }, process.env.JWT_SECRET || "secretkey", { expiresIn: "7d" });
        return { message: "OTP verified successfully", token, success: true };
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        return { message: "Internal Server Error", success: false };
    }
}

export const getFieldExecutiveByEmail = async (email: string) => {
    try {
        await ConnectDb();
        const fieldExecutive = await FieldExecutive.findOne({ email, isActive: true });
        if (!fieldExecutive) {
            return { message: "Field Executive not found", success: false };
        }
        return { message: "Field Executive fetched successfully", data: fieldExecutive, success: true };
    }
    catch (error) {
        return { message: "Internal Server Error", success: false };
    }
}