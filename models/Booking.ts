import mongoose from "mongoose";
type BookingStatus = "pending" | "confirmed" | "in-progress" |"started"| "completed" | "cancelled"|"refunded";
const BookingSchema = new mongoose.Schema({
userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
categoryid: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
employeeid: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false },
status: { type: String as () => BookingStatus, required: true,default:"pending" },
bookingDate: { type: Date, required: true },
isActive: { type: Boolean, default: false },
isDone: { type: Boolean, default: false },
intialamount: { type: Number, required: true },
bookingAmount: { type: Number, required: false },
orderid: { type: String, required: true },
paymentid: { type: String, required: false },
paymentStatus: { type: String, required: false },
intialPaymentStatus: { type: String, required: false },
feedback: { type: String, required: false },
rating: { type: Number, required: false },
refundStatus: { type: String, required: false ,default:"not_requested"},
refundAmount: { type: Number, required: false ,default:0},
refundDate: { type: Date, required: false },
refundid: { type: String, required: false },
}, { timestamps: true })
export default mongoose.models?.Booking || mongoose.model('Booking', BookingSchema);