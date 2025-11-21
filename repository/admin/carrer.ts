import ConnectDb from "@/middleware/connectDb";
import Career from "@/models/Career";
import { CareerInput } from "@/validator/admin/career";

export const getAllCareers = async () => {
    try{
        await ConnectDb();
        const careers = await Career.find()
            .populate('author', 'name email')
            .populate('lastEditedAuthor', 'name email')
            .sort({ createdAt: -1 });
        return {message:"Careers fetched successfully",data:careers,success:true};
    }
    catch(error){
        return {message:"Internal Server Error",error,success:false};
    }
}


export const getActiveCareers = async () => {
    try{
        await ConnectDb();
        const now = new Date();
        const careers = await Career.find({ 
            isActive: true,
            $or: [
                { applicationDeadline: { $exists: false } },
                { applicationDeadline: null },
                { applicationDeadline: { $gte: now } }
            ]
        }).sort({ createdAt: -1 });
        return {message:"Active careers fetched successfully",data:careers,success:true};
    }
    catch(error){
        return {message:"Internal Server Error",error,success:false};
    }
}

export const getCareerById = async (id:string) => {
    try{
        await ConnectDb();
        const career = await Career.findById(id)
            .populate('author', 'name email')
            .populate('lastEditedAuthor', 'name email');
        if(!career){
            return {message:"Career not found",success:false};
        }
        return {message:"Career fetched successfully",data:career,success:true};
    }
    catch(error){
        return {message:"Internal Server Error",error,success:false};
    }
}


export const createCareer = async (careerData:CareerInput & { author: string, lastEditedAuthor: string }) => {
    try{
        await ConnectDb();
        const newCareer = new Career(careerData);
        await newCareer.save();
        return {message:"Career created successfully",data:newCareer,success:true};
    }
    catch(error){
        return {message:"Internal Server Error",error,success:false};
    }
}


export const updateCareer = async (id:string, careerData:Partial<CareerInput> & { lastEditedAuthor: string }) => {
    try{
        await ConnectDb();
        const updatedCareer = await Career.findByIdAndUpdate(id, careerData, {new:true})
            .populate('author', 'name email')
            .populate('lastEditedAuthor', 'name email');
        if(!updatedCareer){
            return {message:"Career not found",success:false};
        }
        return {message:"Career updated successfully",data:updatedCareer,success:true};
    }
    catch(error){
        return {message:"Internal Server Error",error,success:false};
    }
}


export const deleteCareer = async (id:string) => {
    try{
        await ConnectDb();
        const deletedCareer = await Career.findByIdAndDelete(id);
        if(!deletedCareer){
            return {message:"Career not found",success:false};
        }
        return {message:"Career deleted successfully",data:deletedCareer,success:true};
    }
    catch(error){
        return {message:"Internal Server Error",error,success:false};
    }
}