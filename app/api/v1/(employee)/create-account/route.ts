import { NextResponse } from "next/server";
import { createEmployee, updateEmployeeByEmail, getEmployeeByEmail, getEmployeeByEmailAnyStatus } from "@/repository/employee/employee.auth";
import setConnectionRedis from "@/middleware/connectRedis";
import { CreateEmployeeOrder } from "@/utils/employee/createPayment";
import { getFees } from "@/repository/admin/fees";
import { updateOrderidByEmail } from "@/repository/employee/employee.auth";
import { cookies } from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { EmployeeZodSchema } from "@/validator/employee/employee.auth";
import { getCategoryById } from "@/repository/admin/category";

//this is called production grade idempotant api see aniket
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const redisClient = setConnectionRedis();

        const validate = EmployeeZodSchema.safeParse(data);
        if (!validate.success) {
            return NextResponse.json({ message: "Invalid data", success: false }, { status: 400 });
        }
        const validatedData = validate.data;

        const checkdata = await getEmployeeByEmailAnyStatus(validatedData.email);

        if (checkdata.success && !checkdata.data?.isPaid) {
            const existingOrder = await redisClient.get(`employee_${validatedData.email}_order`);
            if (existingOrder) {
                const order = JSON.parse(existingOrder);
                return NextResponse.json({ message: "Employee account exists,Please complete the payment for account activation", success: true, order }, { status: 200 });
            }

            await updateEmployeeByEmail(validatedData.email, validatedData);

            const feesResult = await getFees();
            if (!feesResult.success) {
                return NextResponse.json({ message: "Error fetching fees", success: false }, { status: 500 });
            }

            if (validatedData.categoryid && validatedData.categoryid !== '') {
                const categoryData = await getCategoryById(validatedData.categoryid!);
                if (!categoryData.success) {
                    return NextResponse.json({ message: "Error fetching category data", success: false }, { status: 500 });
                }
                if (validatedData.payrate! < categoryData.category!.categoryMinPrice || validatedData.payrate! > categoryData.category!.categoryMaxPrice) {
                    return NextResponse.json({ message: `Payrate must be between ${categoryData.category!.categoryMinPrice} and ${categoryData.category!.categoryMaxPrice}`, success: false }, { status: 400 });
                }
            }

            const amount = feesResult.data.employeeOneTimeFee * 100; // paise
            const receipt = `emp_reg_${checkdata.data?._id}`;
            const orderResponse: any = await CreateEmployeeOrder(amount, "INR", receipt);
            if (!orderResponse.success) {
                console.error("Payment order creation failed:", orderResponse.error);
                return NextResponse.json({ 
                    message: orderResponse.message || "Error creating payment order", 
                    error: orderResponse.error,
                    success: false 
                }, { status: 500 });
            }
            await redisClient.set(`employee_${validatedData.email}_order`, JSON.stringify(orderResponse.order), "EX", 15 * 60);
            await updateOrderidByEmail(validatedData.email, orderResponse.order.id || "");
            return NextResponse.json({ message: "Employee account exists , Please complete the payment for account activation", success: true, order: orderResponse.order }, { status: 200 });
        }

        if (checkdata.success && checkdata.data.isPaid) {
            return NextResponse.json({
                message: "Employee account exists and is already paid",
                success: true,
                redirect: true
            }, { status: 200 });
        }

        const feesResult = await getFees();
        if (!feesResult.success) {
            return NextResponse.json({ message: "Error fetching fees", success: false }, { status: 500 });
        }

        if (validatedData.categoryid && validatedData.categoryid !== '') {
            const categoryData = await getCategoryById(validatedData.categoryid!);
            if (!categoryData.success) {
                return NextResponse.json({ message: "Error fetching category data", success: false }, { status: 500 });
            }
            if (validatedData.payrate! < categoryData.category!.categoryMinPrice || validatedData.payrate! > categoryData.category!.categoryMaxPrice) {
                return NextResponse.json({ message: `Payrate must be between ${categoryData.category!.categoryMinPrice} and ${categoryData.category!.categoryMaxPrice}`, success: false }, { status: 400 });
            }
        }

        const response = await createEmployee(validatedData);
        if (!response.success) {
            console.error("Employee creation failed:", response.error);
            return NextResponse.json({ 
                message: response.message || "Error creating employee", 
                error: response.error,
                success: false 
            }, { status: 500 });
        }

        const amount = feesResult.data.employeeOneTimeFee * 100; // paise
        const receipt = `emp_reg_${response.employee?._id}`;
        const orderResponse: any = await CreateEmployeeOrder(amount, "INR", receipt);
        if (!orderResponse.success) {
            console.error("Payment order creation failed:", orderResponse.error);
            return NextResponse.json({ 
                message: orderResponse.message || "Error creating payment order", 
                error: orderResponse.error,
                success: false 
            }, { status: 500 });
        }
        await redisClient.set(`employee_${validatedData.email}_order`, JSON.stringify(orderResponse.order), "EX", 15 * 60);
        await updateOrderidByEmail(validatedData.email, orderResponse.order.id || "");

        return NextResponse.json({ ...response, order: orderResponse.order }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
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
            return NextResponse.json({ message: "Invalid data", success: false, errors: validate.error.issues }, { status: 400 });
        }
        
        const validatedData = validate.data;
        
        // Skip category validation for custom services (empty categoryid)
        if (validatedData.categoryid && validatedData.categoryid !== '') {
            const categoryData = await getCategoryById(validatedData.categoryid!);
            if (!categoryData.success) {
                return NextResponse.json({ message: "Error fetching category data", success: false }, { status: 500 });
            }
            if (validatedData.payrate! < categoryData.category!.categoryMinPrice || validatedData.payrate! > categoryData.category!.categoryMaxPrice) {
                return NextResponse.json({ message: `Payrate must be between ${categoryData.category!.categoryMinPrice} and ${categoryData.category!.categoryMaxPrice}`, success: false }, { status: 400 });
            }
        }
        const response = await updateEmployeeByEmail(validatedData.email, validatedData);
        return NextResponse.json(response);

    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}