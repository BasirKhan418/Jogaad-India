import ConnectDb from "@/middleware/connectDb";
import Schedule from "@/models/Schedule";
import Booking from "@/models/Booking";

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
    