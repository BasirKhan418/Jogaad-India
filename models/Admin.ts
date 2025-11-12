import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    img: { type: String },
    phone: { type: String },
    isSuperAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true })
export default mongoose.models?.Admin || mongoose.model('Admin', AdminSchema);