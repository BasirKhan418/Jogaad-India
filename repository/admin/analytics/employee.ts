import ConnectDb from "@/middleware/connectDb";
import Booking from "@/models/Booking";
import Employee from "@/models/Employee";
import Category from "@/models/Category";

export const getallEmployeesAnalytics = async () => {
  try {
    await ConnectDb();

    const employees = await Employee.find().populate("categoryid");
    const bookings = await Booking.find({ employeeid: { $ne: null } });

    const result = employees.map(emp => {
      const empBookings = bookings.filter(
        b => b.employeeid?.toString() === emp._id.toString()
      );

      const totalEarnings = empBookings.reduce(
        (sum, b) => sum + (b.bookingAmount || 0),
        0
      );

      const youEarn = empBookings.reduce(
        (sum, b) => sum + (b.intialamount || 0),
        0
      );

      const empObject = emp.toObject();
      
      // Debug: Log employees without categoryid
      if (!empObject.categoryid) {
        console.log('Employee without categoryid:', {
          name: empObject.name,
          email: empObject.email,
          hasCustomDescription: !!empObject.customDescription,
          customDescription: empObject.customDescription
        });
      }

      return {
        ...empObject,
        categoryName: emp.categoryid?.categoryName || null,
        totalEarnings,
        youEarn,
        bookingsCount: empBookings.length,
      };
    });

    return {
      status: true,
      message: "Successfully fetched",
      data: result,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: "something went wrong" };
  }
};




export const getallEmployeesAnalyticsByDateRange = async (
  startDate: string,
  endDate: string
) => {
  try {
    await ConnectDb();

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const employees = await Employee.find().populate("categoryid");

    const bookings = await Booking.find({
      createdAt: { $gte: start, $lte: end },
      employeeid: { $ne: null },
    });

    const result = employees.map(emp => {
      const empBookings = bookings.filter(
        b => b.employeeid?.toString() === emp._id.toString()
      );

      const totalEarnings = empBookings.reduce(
        (sum, b) => sum + (b.bookingAmount || 0),
        0
      );

      const youEarn = empBookings.reduce(
        (sum, b) => sum + (b.intialamount || 0),
        0
      );

      return {
        ...emp.toObject(),
        categoryName: emp.categoryid?.categoryName || null,
        totalEarnings,
        youEarn,
        bookingsCount: empBookings.length,
      };
    });

    return {
      status: true,
      message: "Successfully fetched",
      data: result,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: "something went wrong" };
  }
};

