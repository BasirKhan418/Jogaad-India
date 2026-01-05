import { NextResponse } from "next/server";
import { createEmployee, updateEmployeeByEmail, getEmployeeByEmail } from "@/repository/employee/employee.auth";
import setConnectionRedis from "@/middleware/connectRedis";
import { CreateEmployeeOrder } from "@/utils/employee/createPayment";
import { getFees } from "@/repository/admin/fees";
import { updateOrderidByEmail } from "@/repository/employee/employee.auth";
import { cookies } from "next/headers";
import { EmployeeZodSchema } from "@/validator/employee/employee.auth";
import { getCategoryById } from "@/repository/admin/category";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { getFieldExecutiveByEmail } from "@/repository/fieldexecutive/auth";
import Razorpay from "razorpay";
import { generateEmployeeQR } from "@/repository/razorpay/generateEmployeeQR";
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});
export async function POST(request: Request) {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value || "";
    const redisClient = setConnectionRedis();

    const isTokenValid = await verifyUserToken(token);
    if (!isTokenValid.success || isTokenValid.type !== "field-exec") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    /** FIELD EXEC CACHE */
    let fieldExecData;
    const cachedFE = await redisClient.get(`fieldexec_${isTokenValid.email}`);
    if (cachedFE) {
      fieldExecData = JSON.parse(cachedFE);
    } else {
      fieldExecData = await getFieldExecutiveByEmail(isTokenValid.email);
      await redisClient.set(
        `fieldexec_${isTokenValid.email}`,
        JSON.stringify(fieldExecData),
        "EX",
        30 * 60
      );
    }

    /** CHECK EMPLOYEE */
    const checkdata = await getEmployeeByEmail(data.email);
    const fees = await getFees();
    if (!fees.success) {
      return NextResponse.json({ success: false, message: "Error fetching fees" }, { status: 500 });
    }

    const amount = fees.data.employeeOneTimeFee * 100;

    /** UNPAID EMPLOYEE → QR */
    if (checkdata.success && !checkdata.data?.isPaid) {
      const order = await generateEmployeeQR({
        email: data.email,
        name: data.name,
        phone: data.phone,
        amount
      });

      return NextResponse.json({
        success: true,
        message: "Employee exists. Complete payment to activate.",
        order,
      });
    }

    /** ALREADY PAID */
    if (checkdata.success && checkdata.data?.isPaid) {
      return NextResponse.json({
        success: true,
        redirect: true,
        message: "Employee already activated",
      });
    }

    /** VALIDATION */
    const validate = EmployeeZodSchema.safeParse(data);
    if (!validate.success) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: validate.error.issues,
      }, { status: 400 });
    }

    /** CATEGORY VALIDATION */
    if (data.categoryid?.trim()) {
      const categoryData = await getCategoryById(data.categoryid);
      if (!categoryData.success) {
        return NextResponse.json({ success: false, message: "Invalid category" }, { status: 400 });
      }

      if (
        data.payrate < categoryData.category.categoryMinPrice ||
        data.payrate > categoryData.category.categoryMaxPrice
      ) {
        return NextResponse.json({
          success: false,
          message: `Payrate must be between ₹${categoryData.category.categoryMinPrice} - ₹${categoryData.category.categoryMaxPrice}`,
        }, { status: 400 });
      }
    }

    /** CREATE EMPLOYEE */
    const cleanedData: any = {
      ...data,
      feid: fieldExecData.data._id,
    };
    if (!cleanedData.categoryid?.trim()) delete cleanedData.categoryid;

    const response = await createEmployee(cleanedData);

    /** QR FOR NEW EMPLOYEE */
    const order = await generateEmployeeQR({
      email: data.email,
      name: data.name,
      phone: data.phone,
      amount
    });

    return NextResponse.json({
      ...response,
      order,
    });

  } catch (error) {
    console.error("PAYMENT ERROR", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}



export const PUT = async (request: Request) => {
    try {
        const data = await request.json();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value || "";
        const verifyToken = await verifyUserToken(token);
        if (!verifyToken.success) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }
        const validate = EmployeeZodSchema.safeParse(data);
        if (!validate.success) {
            const errors = validate.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            return NextResponse.json({ 
                message: `Validation failed: ${errors}`, 
                success: false,
                errors: validate.error.issues 
            }, { status: 400 });
        }
        
        // Validate category and payrate only if categoryid is provided
        if (data.categoryid && data.categoryid.trim() !== '') {
            const categoryData = await getCategoryById(data.categoryid);
            console.log("CATEGORY DATA", categoryData);
            if (!categoryData.success) {
                return NextResponse.json({ message: "Error fetching category data", success: false }, { status: 500 });
            }
            if (data.payrate! < categoryData.category!.categoryMinPrice || data.payrate! > categoryData.category!.categoryMaxPrice) {
                return NextResponse.json({ message: `Payrate must be between ₹${categoryData.category!.categoryMinPrice} and ₹${categoryData.category!.categoryMaxPrice}`, success: false }, { status: 400 });
            }
        }
        
        const cleanedData: any = { ...data };
        if (!cleanedData.categoryid || cleanedData.categoryid.trim() === '') {
            delete cleanedData.categoryid;
        }
        
        const response = await updateEmployeeByEmail(data.email, cleanedData);
        return NextResponse.json(response);

    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}