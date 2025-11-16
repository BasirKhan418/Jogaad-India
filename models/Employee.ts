import mongoose from "mongoose";
export enum PaymentStatus {
    PENDING = "pending",
    PAID= "paid",
    FAILED = "failed"
}
const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    address: { type: String ,required:true},
    phone: { type: String ,required:true},
    pincode: { type: String, required: true },
    bankName: { type: String ,required:false},
    bankAccountNumber: { type: String ,required:false},
    bankIfscCode: { type: String ,required:false},
    img: { type: String,required:false},
    isPaid: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    orderid: { type: String, required: false },
    paymentid: { type: String, required: false },
    paymentStatus: { type: String, default: PaymentStatus.PENDING },
    categoryid: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
    payrate: { type: Number, required: false  },
}, { timestamps: true })
export default mongoose.models?.Employee || mongoose.model('Employee', EmployeeSchema);