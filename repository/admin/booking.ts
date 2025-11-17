import ConnectDb from "@/middleware/connectDb";
import Booking from "@/models/Booking";

export const fetchAllBookings = async () => {
    try{
        await ConnectDb();
        const bookings = await Booking.find().populate("categoryid").populate("userid").populate("employeeid");
        return {message:"Bookings fetched successfully",success:true,data:bookings};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}
export const fetchBookingsByStatus = async (status: string) => {
    try{
        await ConnectDb();
        const bookings = await Booking.find({status}).populate("categoryid").populate("userid").populate("employeeid");
        return {message:"Bookings fetched successfully",success:true,data:bookings};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}