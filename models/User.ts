import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    address: { type: String ,required:false},
    phone: { type: String ,required:false},
    isImposedFine: { type: Boolean, default: false },
    img: { type: String,required:false},
    isVerified: { type: Boolean, default: false },
}, { timestamps: true })
export default mongoose.models?.User || mongoose.model('User', UserSchema);