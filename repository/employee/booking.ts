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
        await Schedule.findByIdAndDelete(schedule._id);
        
        // Update booking status
        let booking =await Booking.findByIdAndUpdate(bookingId, {status: "in-progress", employeeid: employeeId}, {new: true});
        return {message:"Booking accepted successfully",success:true,data:booking};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}

export const changeBookingStatusByEmployee = async (bookingId: string) => {
    try{
        await ConnectDb();
        let booking =await Booking.findByIdAndUpdate(bookingId, {status: "started"}, {new: true});
        return {message:"Booking status updated to started",success:true,data:booking};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}

export const completeBookingByEmployee = async (bookingId: string) => {
    try{
        await ConnectDb();
        const booking = await Booking.findById(bookingId);
        if(!booking){
            return {message:"Booking not found",success:false};
        }
        // Only allow completion if payment is done
        if(booking.paymentStatus !== "paid"){
            return {message:"Payment must be completed before marking as done",success:false};
        }
        let updatedBooking = await Booking.findByIdAndUpdate(bookingId, {
            status: "completed",
            isDone: true,
            isActive: false
        }, {new: true});
        return {message:"Booking marked as completed",success:true,data:updatedBooking};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}
    
export const TakePaymentForBooking = async (bookingId: string, amount: number) => {
    try{
        await ConnectDb();
        const recipt = `booking_${bookingId}}`;
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
        
        const updatebooking = await Booking.findByIdAndUpdate(bookingId, {
            orderid: paymentResult.order.id, 
            bookingAmount: amount,
            paymentStatus: "pending",
            renderPaymentButton: true 
        }, {new: true})
        .populate('userid')
        .populate('categoryid');
        
        return {message:"Payment request sent to customer", success:true, data: updatebooking};
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