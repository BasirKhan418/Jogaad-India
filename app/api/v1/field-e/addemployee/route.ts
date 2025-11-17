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
export async function POST(request: Request) {
    try {
        const cookiesStore = await cookies();
        const redisClient = setConnectionRedis();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        if (!isTokenValid.success || isTokenValid.type !== "field-exec") {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }
        let fieldExecData;
        const redisdata = await redisClient.get(`fieldexec_${isTokenValid.email}`);
        if (!redisdata) {
            fieldExecData = await getFieldExecutiveByEmail(isTokenValid.email);
            await redisClient.set(`fieldexec_${isTokenValid.email}`, JSON.stringify(fieldExecData), "EX", 30 * 60); //expire in 30 minutes
        }
        else{
            fieldExecData = JSON.parse(redisdata);
        }
        
        const data = await request.json();
        
        const checkdata = await getEmployeeByEmail(data.email);
        if (checkdata.success && !checkdata.data?.isPaid) {
            const getExistingOrder = await redisClient.get(`employee_${data.email}_order`);
            if (getExistingOrder) {
                const order = JSON.parse(getExistingOrder);
                return NextResponse.json({ message: "Employee account exists,Please complete the payment for account activation", success: true, order }, { status: 200 });

            }
            else {
                const getFeesdata = await getFees();
                if (!getFeesdata.success) {
                    return NextResponse.json({ message: "Error fetching fees", success: false }, { status: 500 });
                }
                
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

                const amount = getFeesdata.data.employeeOneTimeFee * 100; //amount in paise
                const receipt = `emp_reg_${checkdata.data?._id}`;
                const orderResponse: any = await CreateEmployeeOrder(amount, "INR", receipt);
                if (!orderResponse.success) {
                    return NextResponse.json({ message: "Error creating payment order", success: false }, { status: 500 });
                }
                await redisClient.set(`employee_${data.email}_order`, JSON.stringify(orderResponse.order), "EX", 15 * 60); //expire in 15 minutes
                await updateOrderidByEmail(data.email, orderResponse.order.id || "");
                return NextResponse.json({ message: "Employee account exists , Please complete the payment for account activation", success: true, order: orderResponse.order }, { status: 200 });
            }
        }
        if (checkdata.success && checkdata.data.isPaid) {
            return NextResponse.json({
                message: "Employee account exists and is already paid",
                success: true,
                redirect: true
            }, { status: 200 });

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
        
        const getFeesdata = await getFees();

        if (!getFeesdata.success) {
            return NextResponse.json({ message: "Error fetching fees", success: false }, { status: 500 });
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
        
        // Clean data before creating employee - remove empty categoryid
        const cleanedData: any = { ...data, feid: fieldExecData.data?._id };
        if (!cleanedData.categoryid || cleanedData.categoryid.trim() === '') {
            delete cleanedData.categoryid;
        }
        
        const response = await createEmployee(cleanedData);
        const amount = getFeesdata.data.employeeOneTimeFee * 100; //amount in paise
        const receipt = `emp_reg_${response.employee?._id}`;
        const orderResponse: any = await CreateEmployeeOrder(amount, "INR", receipt);
        if (!orderResponse.success) {
            return NextResponse.json({ message: "Error creating payment order", success: false }, { status: 500 });
        }
        await redisClient.set(`employee_${data.email}_order`, JSON.stringify(orderResponse.order), "EX", 15 * 60); //expire in 15 minutes
        await updateOrderidByEmail(data.email, orderResponse.order.id || "");

        return NextResponse.json({ ...response, order: orderResponse.order }, { status: 200 });

    }
    catch (error) {
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
        
        // Clean data before updating - remove empty categoryid
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