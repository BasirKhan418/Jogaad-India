import mongoose from "mongoose";
const FieldExecutiveSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    address: { type: String ,required:false},
    pincode: { type: String, required: false },
    block: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    phone: { type: String ,required:true},
    img: { type: String,required:false},
}, { timestamps: true })
export default mongoose.models?.FieldExecutive || mongoose.model('FieldExecutive', FieldExecutiveSchema);