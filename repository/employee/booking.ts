import ConnectDb from "@/middleware/connectDb";
import Schedule from "@/models/Schedule";
import Booking from "@/models/Booking";
import { CreateBookingRazorPay } from "@/utils/user/createBooking";
export const AcceptScheduleForBooking = async (bookingId: string, employeeId: string) => {
    try{
        await ConnectDb();
        const schedule = await Schedule.findOne({bookingid: bookingId});
        if(!schedule){
            return {message:"Schedule not found",success:false};
        }
        // Update schedule to mark as accepted
        await Schedule.findByIdAndUpdate(schedule._id, {isAccepted: true}, {new: true});
        
        // Update booking status
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
        const paymentResult = await CreateBookingRazorPay(Math.floor(amount*100), "INR",recipt) as { success: boolean; order?: { id?: string } | null; message?: string; error?: string };
        
        if(!paymentResult || !paymentResult.success){
            console.error("Payment order creation failed:", paymentResult?.message || paymentResult?.error);
            return {
                message: paymentResult?.message || "Error creating payment order",
                success: false,
                error: paymentResult?.error
            };
        }
        
        if(!paymentResult.order || !paymentResult.order.id){
            console.error("Payment order missing order ID");
            return {
                message: "Payment order created but missing order ID",
                success: false
            };
        }
        
        const updatebooking = await Booking.findByIdAndUpdate(bookingId, {orderid: paymentResult.order.id, bookingAmount: amount,paymentStatus: "pending"}, {new: true});
        return {message:"Payment order created and booking updated", success:true, data: updatebooking};
    }
    catch(error){
        console.error("TakePaymentForBooking error:", error);
        return {
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}