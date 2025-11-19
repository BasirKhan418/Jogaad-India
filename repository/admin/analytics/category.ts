import ConnectDb from "@/middleware/connectDb";
import Booking from "@/models/Booking";
import Category from "@/models/Category";

export const getallCategoriesAnalytics = async () => {
  try {
    await ConnectDb();

    const categories = await Category.find();


    const bookings = await Booking.find();
    const result = categories.map(category => {
      const categoryId = category._id.toString();
      const categoryBookings = bookings.filter(
        b => b.categoryid.toString() === categoryId
      );

      const count = categoryBookings.length;

      const totalEarnings = categoryBookings.reduce(
        (sum, b) => sum + (b.bookingAmount || 0),
        0
      );
      const totalInitialAmount = categoryBookings.reduce(
        (sum, b) => sum + (b.intialamount || 0),
        0
      );

      return {
        ...category.toObject(),
        bookingCount: count,
        totalEarnings: totalEarnings,
        totalInitialAmount: totalInitialAmount
      };
    });
    result.sort((a, b) => b.bookingCount - a.bookingCount);

    return {
      status: true,
      message: "Successfully fetched",
      data: result
    };

  } catch (error) {
    console.log(error);
    return { status: false, message: "something went wrong" };
  }
};

export const getallCategoriesAnalyticsByDateRange = async (
  startDate: string,
  endDate: string
) => {
  try {
    await ConnectDb();

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // include full end date

    const categories = await Category.find();

    const bookings = await Booking.find({
      createdAt: { $gte: start, $lte: end }
    });

    const result = categories.map(category => {
      const categoryId = category._id.toString();

      const categoryBookings = bookings.filter(
        b => b.categoryid.toString() === categoryId
      );

      const count = categoryBookings.length;

      const totalEarnings = categoryBookings.reduce(
        (sum, b) => sum + (b.bookingAmount || 0),
        0
      );
      const totalInitialAmount = categoryBookings.reduce(
        (sum, b) => sum + (b.intialamount || 0),
        0
      );

      return {
        ...category.toObject(),
        bookingCount: count,
        totalEarnings,
        totalInitialAmount
      };
    });
    result.sort((a, b) => b.bookingCount - a.bookingCount);

    return {
      status: true,
      message: "Successfully fetched",
      data: result
    };

  } catch (error) {
    console.log(error);
    return { status: false, message: "something went wrong" };
  }
};
