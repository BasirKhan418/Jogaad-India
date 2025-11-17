
import ConnectDb from "@/middleware/connectDb";
import FieldExecutive from "@/models/FieldExecutive";
import Employee from "@/models/Employee";
export async function getFieldExecutiveAnalyticsAdmin(email: string) {
  try {
    const now = new Date();

    // Correct UTC-based ranges
    const startOfMonth = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1, 0, 0, 0, 0
    ));

    const endOfMonth = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      0, 23, 59, 59, 999
    ));

    await ConnectDb();

    const findfieldexec = await FieldExecutive.findOne({ email });

    if (!findfieldexec) {
      return { success: false, message: "Field Executive not found" };
    }

    const currentTarget = await Employee.countDocuments({
      feid: findfieldexec._id,
      isActive: true,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    return {
      success: true,
      data: {
        assignTarget: findfieldexec.target,
        currentTarget
      }
    };

  } catch (err) {
    return {
      success: false,
      message: "Error fetching analytics",
      error: err
    };
  }
}