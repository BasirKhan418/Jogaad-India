import mongoose from "mongoose";

const CareerSchema = new mongoose.Schema({
    role: { type: String, required: true },
    experience: { type: String, required: true }, 
    requirements: { type: [String], required: true }, 
    description: { type: String, required: true },
    location: { type: String, required: true }, 
    mode: { type: String, required: true, enum: ['remote', 'offline', 'hybrid'] },
    applyUrl: { type: String, required: true },
    salary: { type: String, required: false }, 
    department: { type: String, required: false },
    employmentType: { type: String, required: false, enum: ['full-time', 'part-time', 'contract', 'internship'], default: 'full-time' },
    skills: { type: [String], required: false }, 
    benefits: { type: [String], required: false }, 
    isActive: { type: Boolean, default: true },
    applicationDeadline: { type: Date, required: false },
    lastEditedAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true });

// add index for better query performance
CareerSchema.index({ isActive: 1, createdAt: -1 });
CareerSchema.index({ mode: 1 });
CareerSchema.index({ department: 1 });

// virtual for checking if application deadline has passed
CareerSchema.virtual('isExpired').get(function() {
    if (!this.applicationDeadline) return false;
    return new Date() > this.applicationDeadline;
});

// ensure virtual fields are serialized
CareerSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Career || mongoose.model('Career', CareerSchema);