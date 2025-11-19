import ConnectDb from "@/middleware/connectDb";
import Booking from "@/models/Booking";
import User from "@/models/User";
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

export const getBookingById = async (id:string) => {
try{
await ConnectDb();
const booking = await Booking.findById(id);
if(!booking){
    return {message:"Booking not found",success:false,data:null};
}
return {message:"Booking found",success:true,data:booking};
}
catch(error){
    return {message:"Internal Server Error",success:false};
}
}

export const isFineImposedForBooking = async (id: string) => {
  try {
    await ConnectDb();

    const booking = await Booking.findById(id);

    if (!booking) {
      return { message: "Booking not found", success: false, data: null };
    }

    // Extract createdAt
    const createdAt = new Date(booking.createdAt).getTime();
    const now = Date.now();

    // Difference in milliseconds
    const diffMs = now - createdAt;

    // Convert to minutes
    const diffMinutes = diffMs / (1000 * 60);

    const isFine = diffMinutes >= 25;

    return {
      message: "Fine check completed",
      success: true,
      data: {
        fine: isFine,
        minutesPassed: Math.floor(diffMinutes),
      },
    };
  } catch (error) {
    return { message: "Internal Server Error", success: false };
  }
};

export const markFine = async (id: string) => {
    try{
        await ConnectDb();
        const updateuser = await User.findByIdAndUpdate(id, { isImposedFine: true }, { new: true });
        if(!updateuser){
            return { message: "User not found", success: false };
        }
        return { message: "Fine imposed on user successfully", success: true };
    }
    catch(error){
        return { message: "Internal Server Error", success: false };
    }
}

export const getAllBookingsForUser = async (userid: string) => {
    try{
        await ConnectDb();
        const bookings = await Booking.find({ userid })
            .populate('categoryid')
            .populate('employeeid')
            .populate('userid')
            .sort({ createdAt: -1 });
        return { message: "Bookings retrieved successfully", success: true, data: bookings };
    }
    catch(error){
        return { message: "Internal Server Error", success: false };
    }
}