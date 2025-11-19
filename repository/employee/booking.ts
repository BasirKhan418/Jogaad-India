import ConnectDb from "@/middleware/connectDb";
import Schedule from "@/models/Schedule";
import Booking from "@/models/Booking";
import { CreateBookingRazorPay } from "@/utils/user/createBooking";
export const AcceptScheduleForBooking = async (bookingId: string, employeeId: string) => {
    try{
        await ConnectDb();
        const schedule = await Schedule.findOne({bookingid: bookingId, employeeid: employeeId});
        if(!schedule){
            return {message:"Schedule not found",success:false};
        }
        let booking =await Booking.findByIdAndUpdate(bookingId, {status: "in-progress", employeeid: employeeId}, {new: true});
        return {message:"Booking accepted successfully",success:true,data:booking};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}

export const chnageBookingStatusByEmployee = async (bookingId: string) => {
    try{
        await ConnectDb();
        let booking =await Booking.findByIdAndUpdate(bookingId, {status: "started"}, {new: true});
        return {message:"Booking status updated to started",success:true,data:booking};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}
    
export const TakePaymentForBooking = async (bookingId: string, amount: number) => {
    try{
        await ConnectDb();
        const recipt = `booking_${bookingId}_${Date.now()}`;
        const paymentResult = await CreateBookingRazorPay(Math.floor(amount*100), "INR",recipt) as { success: boolean; order?: { id?: string } | null };
        if(!paymentResult || !paymentResult.success || !paymentResult.order || !paymentResult.order.id){
            return {message:"Error creating payment order",success:false};
        }
        const updatebooking = await Booking.findByIdAndUpdate(bookingId, {orderid: paymentResult.order.id, bookingAmount: amount,paymentStatus: "pending"}, {new: true});
        return {message:"Payment order created and booking updated", success:true, data: updatebooking};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}