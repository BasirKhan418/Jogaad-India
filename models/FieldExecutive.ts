import mongoose from "mongoose";
const FieldExecutiveSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    address: { type: String ,required:true},
    pincode: { type: String, required: true },
    block: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    orderid:{ type: String, required: true },
    qrcodeimg:{ type: String, required: false},
    customerid:{ type: String, required: false},
    paymentid:{ type: String, required: false},
    phone: { type: String ,required:true},
    img: { type: String,required:false},
    target: { type: Number, default: 0 },
}, { timestamps: true })
export default mongoose.models?.FieldExecutive || mongoose.model('FieldExecutive', FieldExecutiveSchema);