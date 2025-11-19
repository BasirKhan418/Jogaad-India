import ConnectDb from "@/middleware/connectDb";
import Booking from "@/models/Booking";
import Schedule from "@/models/Schedule";
import Employee from "@/models/Employee";
import { sendScheduletoEmployee } from "@/email/employee/schedule";
export const fetchAllBookings = async () => {
    try{
        await ConnectDb();
        const bookings = await Booking.find({ intialPaymentStatus: "paid" }).populate("categoryid").populate("userid").populate("employeeid");
        return {message:"Bookings fetched successfully",success:true,data:bookings};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}
export const fetchBookingsByStatus = async (status: string) => {
    try{
        await ConnectDb();
        const bookings = await Booking.find({status, intialPaymentStatus: "paid"}).populate("categoryid").populate("userid").populate("employeeid");
        return {message:"Bookings fetched successfully",success:true,data:bookings};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}

export const scheduleBooking = async (bookingid: string, employeeid: string) => {
try{
await ConnectDb();
const findbyonedelete = await Schedule.findOneAndDelete({bookingid});
const newSchedule = new Schedule({bookingid, employeeid});
await newSchedule.save();
let employee = await Employee.findById(employeeid);
const booking = await Booking.findById(bookingid).populate("categoryid");
console.log(booking);

sendScheduletoEmployee({
    name: employee?.name || "Employee",
    email: employee?.email || "",
    serviceName: booking?.categoryid?.categoryName || "Scheduled Service",
    bookingId: bookingid,
    scheduledDate: booking?.bookingDate?.toDateString() || "To Be Decided",
})

//trigger booking email to employeeid for new schedule

return {message:"Booking scheduled successfully",success:true,data:newSchedule};
}
catch(error){
    return {message:"Internal Server Error",success:false};
}
}

export const fetchSchedules = async () => {
    try{
        await ConnectDb();
        const schedules = await Schedule.find().populate("employeeid");
        return {message:"Schedules fetched successfully",success:true,data:schedules};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}