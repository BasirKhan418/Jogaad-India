import mongoose from "mongoose";
const FieldExecutiveSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    address: { type: String ,required:true},
    pincode: { type: String, required: true },
    block: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    phone: { type: String ,required:true},
    img: { type: String,required:false},
}, { timestamps: true })
export default mongoose.models?.FieldExecutive || mongoose.model('FieldExecutive', FieldExecutiveSchema);