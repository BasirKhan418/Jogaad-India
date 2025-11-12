import ConnectDb from "@/middleware/connectDb";
import Fees from "@/models/Fees";
import { FeesInput } from "@/validator/admin/fees";
//create or update fees
export const updateFees = async (id: string, updateData: FeesInput) => {
    try {
        await ConnectDb();
        const updatedFees = await Fees.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedFees) {
            return { message: "Fees not found", success: false };
        }
        return { message: "Fees updated successfully", fees: updatedFees, success: true };
    }
    catch (error) {
        return { message: "Error updating fees", error, success: false };
    }
}

export const createFees = async (feesData: FeesInput) => {
    try {
        await ConnectDb();
        const newFees = new Fees(feesData);
        await newFees.save();
        return { message: "Fees created successfully", fees: newFees, success: true };
    }
    catch (error) {
        return { message: "Error creating fees", error, success: false };
    }

}

export const getFees = async () => {
    try {
        await ConnectDb();
        const fees = await Fees.findOne({});
        if (!fees) {
            return { message: "Fees not found", success: false };
        }
        return { message: "Fees retrieved successfully", data:fees, success: true };
    }
    catch (error) {
        return { message: "Error retrieving fees", error, success: false };
    }
}