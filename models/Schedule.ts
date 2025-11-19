import mongoose from "mongoose";
const ScheduleSchema = new mongoose.Schema({
bookingid: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
employeeid: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
isAccepted: { type: Boolean, default: false },
}, { timestamps: true })
export default mongoose.models?.Schedule || mongoose.model('Schedule', ScheduleSchema);