import ConnectDb from "@/middleware/connectDb";
import setConnectionRedis from "@/middleware/connectRedis";
import FieldExecutive from "@/models/FieldExecutive";
import { FieldExecutiveType } from "@/validator/fieldexecutive/field.validator";
import { sendFieldExecutiveWelcomeEmail } from "@/email/field-executive/welcome";
export const createFieldExecutive = async (data: FieldExecutiveType) => {
try{
    await ConnectDb();
    const dataExists = await FieldExecutive.findOne({email:data.email});
    if(dataExists){
        return {message:"Field Executive with this email already exists",success:false};
    }
    const newFieldExecutive = new FieldExecutive(data);
    await newFieldExecutive.save();
    await sendFieldExecutiveWelcomeEmail({name:data.name,email:data.email});
    return {message:"Field Executive created successfully",success:true};
}
catch(error){
    return {message:"Internal Server Error",success:false};
}
}

export const getAllFieldExecutives = async () => {
    try{
        await ConnectDb();
        const fieldExecutives = await FieldExecutive.find().sort({createdAt:-1});
        return {message:"Field Executives fetched successfully",data:fieldExecutives,success:true};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}

export const updateFieldExecutive = async (id:string,updateData:Partial<FieldExecutiveType>) => {
    try{
        await ConnectDb();
        const updatedFieldExecutive = await FieldExecutive.findByIdAndUpdate(id,updateData,{new:true});
        if(!updatedFieldExecutive){
            return {message:"Field Executive not found",success:false};
        }
        return {message:"Field Executive updated successfully",data:updatedFieldExecutive,success:true};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}