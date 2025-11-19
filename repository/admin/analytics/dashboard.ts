import ConnectDb from "@/middleware/connectDb";
import Booking from "@/models/Booking";
import Employee from "@/models/Employee";
import { getFees } from "../fees";
export const getallData = async () => {
    try {
        await ConnectDb();
        const fees = await getFees();
        const allemployees = await Employee.find({ isActive: true });
        const employeefee = allemployees.length * (fees.data.employeeOneTimeFee || 0);
        const allBooking = await Booking.find({ intialPaymentStatus: "paid", status: "confirmed" });
        const totalearnings = allBooking.reduce((acc, booking) => {
            return acc + (booking.
                intialamount
                || 0 + booking.bookingAmount || 0);
        }, 0)
        return { success: true, data: {
            totalEarnings: totalearnings,
            employeeFee: employeefee
        } };
    }
    catch (error) {
        return { success: false, message: "Database connection failed" };
    }

}

export const getDataByDateRange = async (startDate: string, endDate: string) => {
    try {
        await ConnectDb();
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set to the end of the day
        const allBooking = await Booking.find({
            intialPaymentStatus: "paid",
            status: "confirmed",
            createdAt: { $gte: start, $lte: end }
        });
        const totalearnings = allBooking.reduce((acc, booking) => {
            return acc + (booking.
                intialamount
                || 0 + booking.bookingAmount || 0);
        }, 0)
        const allemployees = await Employee.find({ isActive: true, createdAt: { $gte: start, $lte: end } });
        const fees = await getFees();
        const employeefee = allemployees.length * (fees.data.employeeOneTimeFee || 0);
        return { success: true, data: {
            totalEarnings: totalearnings,
            employeeFee: employeefee
        } };
    }
    catch (error) {
        return { success: false, message: "something went wrong" };
    }
}