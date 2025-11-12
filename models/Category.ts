import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
  categoryType: { 
    type: String, 
    required: true, 
    enum: ["Service", "Maintenance"],
  },
  categoryDescription: { type: String }, 
  categoryUnit: { type: String }, 
  recommendationPrice: { 
    type: Number, 
    default: 0, 
    max: 100000, 
  },
  categoryMinPrice: { type: Number, required: false }, 
  categoryMaxPrice: { type: Number, required: false },
  categoryStatus: { type: Boolean, default: true },
  img: { type: String, required: false },
  updatedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
}, { timestamps: true });

export default mongoose.models?.Category || mongoose.model("Category", CategorySchema);
