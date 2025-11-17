import { NextResponse, NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { getFees } from "@/repository/admin/fees";
import { verifyUserByEmail } from "@/repository/user/user.auth";
import { BookingSchemaZod } from "@/validator/user/booking";
import { CreateBookingRazorPay } from "@/utils/user/createBooking";
import { createUserBooking } from "@/repository/user/booking";
import Category from "@/models/Category";
import ConnectDb from "@/middleware/connectDb";


export const POST = async (request: NextRequest) => {
    try {
        await ConnectDb();

        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        
        if (!isTokenValid.success || isTokenValid.type !== "user") {
            return NextResponse.json({
                message: "Unauthorized. Please login to continue.",
                success: false
            }, { status: 401 });
        }

        const data = await request.json();
        const { categoryid, bookingDate } = data;

        if (!categoryid || !bookingDate) {
            return NextResponse.json({
                message: "Category and booking date are required",
                success: false
            }, { status: 400 });
        }

        const selectedDate = new Date(bookingDate);
        const now = new Date();
        
        if (isNaN(selectedDate.getTime())) {
            return NextResponse.json({
                message: "Invalid booking date format",
                success: false
            }, { status: 400 });
        }
        
        if (selectedDate.getTime() <= now.getTime()) {
            return NextResponse.json({
                message: "Booking date must be in the future",
                success: false
            }, { status: 400 });
        }

        const hoursDifference = (selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursDifference < 24) {
            return NextResponse.json({
                message: "Booking must be made at least 24 hours in advance",
                success: false
            }, { status: 400 });
        }

        const user = await verifyUserByEmail(isTokenValid.email);
        if (!user.success || !user.data) {
            return NextResponse.json({
                message: "User not found. Please login again.",
                success: false
            }, { status: 404 });
        }

        if (!user.data.address || !user.data.pincode) {
            return NextResponse.json({
                message: "Please add your address and pincode before booking a service",
                success: false,
                requiresAddress: true
            }, { status: 400 });
        }

        const category = await Category.findById(categoryid);
        if (!category) {
            return NextResponse.json({
                message: "Selected service category not found",
                success: false
            }, { status: 404 });
        }

        if (!category.categoryStatus) {
            return NextResponse.json({
                message: "Selected service is currently unavailable",
                success: false
            }, { status: 400 });
        }

        const feesData = await getFees();
        if (!feesData.success || !feesData.data) {
            return NextResponse.json({
                message: "Service fees configuration not found. Please contact support.",
                success: false
            }, { status: 404 });
        }

        let amount = 0;
        const baseAmount = feesData.data.userOneTimeFee || 0;
        const fineAmount = feesData.data.fineFees || 0;

        if (user.data.isImposedFine) {
            amount = (baseAmount + fineAmount) * 100;
        } else {
            amount = baseAmount * 100;
        }

        if (amount <= 0) {
            return NextResponse.json({
                message: "Invalid booking amount. Please contact support.",
                success: false
            }, { status: 400 });
        }

        const receipt = `booking_rcpt_${new Date().getTime()}`;
        const orderdata = await CreateBookingRazorPay(amount, "INR", receipt);
        
        if (!orderdata.success || !orderdata.order) {
            return NextResponse.json({
                message: orderdata.message || "Failed to create payment order. Please try again.",
                success: false
            }, { status: 500 });
        }

        const orderId = (orderdata.order as any).id;

        const newData = {
            categoryid: categoryid,
            bookingDate: bookingDate,
            userid: user.data._id.toString(),
            intialamount: amount / 100, 
            intialPaymentStatus: "pending",
            orderid: orderId,
            status: "pending"
        };

        const validate = BookingSchemaZod.safeParse(newData);
        if (!validate.success) {
            return NextResponse.json({
                message: "Invalid booking data",
                success: false,
                errors: validate.error.issues
            }, { status: 400 });
        }

        const bookingdata = await createUserBooking(validate.data);
        
        if (!bookingdata.success || !bookingdata.data) {
            return NextResponse.json({
                message: "Failed to create booking. Please try again.",
                success: false
            }, { status: 500 });
        }

        return NextResponse.json({
            message: "Booking created successfully! Please complete the initial payment.",
            success: true,
            order: orderdata.order,
            booking: bookingdata.data,
            info: {
                initialAmount: amount / 100,
                hasFine: user.data.isImposedFine,
                fineAmount: user.data.isImposedFine ? fineAmount : 0,
                baseAmount: baseAmount,
                notice: "After payment, a service engineer will visit your location to assess the work. Final payment will be calculated based on actual service or maintenance required."
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error("Create booking error:", error);
        return NextResponse.json({
            message: "An unexpected error occurred. Please try again.",
            success: false,
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        }, { status: 500 });
    }
}