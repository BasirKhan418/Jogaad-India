import ConnectDb from "@/middleware/connectDb";
import Booking from "@/models/Booking";
import Schedule from "@/models/Schedule";
import "@/models/Category"; // Ensure Category model is registered
import "@/models/User"; // Ensure User model is registered

const calculateEmployeeStats = (bookings: any[]) => {
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === "completed");

  // Only count bookingAmount (service payment from "Take Payment" option)
  // Do not include intialamount as that goes to platform
  const totalEarnings = completedBookings.reduce((sum, b) => {
    const servicePayment = b.bookingAmount || 0;
    return sum + servicePayment;
  }, 0);

  const reviews = completedBookings.filter(b => b.rating !== undefined);
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
      : 0;

  const completionRate =
    totalBookings > 0 ? (completedBookings.length / totalBookings) * 100 : 0;

  return {
    totalBookings,
    completedBookings: completedBookings.length,
    completionRate: Number(completionRate.toFixed(2)),
    totalEarnings,
    totalReviews,
    averageRating: Number(averageRating.toFixed(2)),
    recentData: bookings
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5),
  };
};

export const getEmployeeAnalytics = async (employeeId: string) => {
  try {
    await ConnectDb();
     const findSchedules = await Schedule.find({ employeeid: employeeId });
     console.log("Schedules found:", findSchedules.length);
    const bookings = await Booking.find({ employeeid: employeeId })
      .populate('categoryid', 'categoryName categoryType')
      .populate('userid', 'name email address pincode phone');

    const stats = calculateEmployeeStats(bookings);
    const newstats = { ...stats, pendings: findSchedules.length ,totalBookings: stats.totalBookings + findSchedules.length};

    return {
      success: true,
      message: "Employee analytics fetched successfully",
      data: newstats,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching employee analytics",
      error,
    };
  }
};


export const getEmployeeAnalyticsByDateRange = async (
  employeeId: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    await ConnectDb();

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      employeeid: employeeId,
      createdAt: { $gte: start, $lte: end },
    });

    const stats = calculateEmployeeStats(bookings);

    return {
      success: true,
      message: "Employee analytics (date-filtered) fetched successfully",
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching employee analytics by date range",
      error,
    };
  }
};


export const getAllBookings = async (employeeId: string) => {
    try{
        await ConnectDb();
        const bookings = await Booking.find({ employeeid: employeeId })
            .populate('categoryid')
            .populate('userid');
        return {message:"Bookings fetched successfully",bookings,success:true};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}

export const getPendingSchedules = async (employeeId: string) => {
    try{
        await ConnectDb();
        const schedules = await Schedule.find({ employeeid: employeeId })
            .populate({
                path: 'bookingid',
                populate: [
                    { path: 'userid' },
                    { path: 'categoryid' }
                ]
            });
        return {message:"Schedules fetched successfully",schedules,success:true};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}