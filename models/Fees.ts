import mongoose from "mongoose";
const FeesSchema = new mongoose.Schema({
userOneTimeFee: { type: Number, required: true, default: 0 },
employeeOneTimeFee: { type: Number, required: true, default: 0 },
fineFees: { type: Number, required: true, default: 0 },
}, { timestamps: true })
export default mongoose.models?.Fees || mongoose.model('Fees', FeesSchema);