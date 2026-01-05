import mongoose from "mongoose";
export enum PaymentStatus {
    PENDING = "pending",
    PAID= "paid",
    FAILED = "failed"
}
const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    address: { type: String ,required:false},
    phone: { type: String ,required:true},
    pincode: { type: String, required: false },
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
        othersCategory: { type: Boolean, default: false },
        description: { type: String, required: false },
    payrate: { type: Number, required: false  },
    feid: { type: mongoose.Schema.Types.ObjectId, ref: 'FieldExecutive', required: false },
}, { timestamps: true })

// Ensure schema updates take effect in dev by removing cached model
if (mongoose.models.Employee) {
    delete (mongoose.models as any).Employee;
}
export default mongoose.model('Employee', EmployeeSchema);