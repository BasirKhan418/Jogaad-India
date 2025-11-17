import ConnectDb from "@/middleware/connectDb";
import FieldExecutive from "@/models/FieldExecutive";
import Employee from "@/models/Employee";

export async function getFieldExecutiveAnalytics(email: string) {
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

export const getAllEmployeesUnderFieldExec = async (email: string) => {
    try{
        await ConnectDb();
        const findfieldexec = await FieldExecutive.findOne({email});
        if(!findfieldexec){
            return {success:false,message:"Field Executive not found"};
        }
        const employees = await Employee.find({feid:findfieldexec._id}).sort({createdAt:-1});
        return {success:true,data:employees};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}

export const getEmployeesUnderFieldExecByPage = async (email:string,start:number,limit:number) => {
    try{
        await ConnectDb();
        const findfieldexec = await FieldExecutive.findOne({email});
        if(!findfieldexec){
            return {success:false,message:"Field Executive not found"};
        }
        const employees = await Employee.find({feid:findfieldexec._id})
        .skip(start)
        .limit(limit).sort({createdAt:-1});
        return {success:true,data:employees};

    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}
