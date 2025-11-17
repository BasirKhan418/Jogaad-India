import ConnectDb from "@/middleware/connectDb";
import Booking from "@/models/Booking";

export const createUserBooking = async (bookingdata: any) => {
    try{
        await ConnectDb();
        const newBooking = new Booking(bookingdata);
        const savedBooking = await newBooking.save();
        return {message:"Booking created successfully",success:true,data:savedBooking};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}