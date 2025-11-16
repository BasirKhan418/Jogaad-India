import ConnectDb from "@/middleware/connectDb";
import setConnectionRedis from "@/middleware/connectRedis";
import FieldExecutive from "@/models/FieldExecutive";
import { FieldExecutiveType } from "@/validator/fieldexecutive/field.validator";
import { sendFieldExecutiveWelcomeEmail } from "@/email/field-executive/welcome";
import { sendFieldExecutiveOtp } from "@/email/field-executive/sendotp";
import jwt from "jsonwebtoken";
//create field executive
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
//get all field executives
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
//update field executive
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
//login field executive
export const loginFieldExecutive = async (email:string) => {
    try{
        const redisClient =  setConnectionRedis();
        await ConnectDb();
        const fieldExecutive = await FieldExecutive.findOne({email,isActive:true});
        if(!fieldExecutive){
            return {message:"Field Executive not found",success:false};
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.set(`field-exec-otp-${email}`,otp,"EX",300);
        await sendFieldExecutiveOtp({email, otp});
        return {message:"OTP sent successfully",success:true};

    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}
//verify field executive otp 
export const verifyFieldExecutiveOtp = async (email:string,otp:string) => {
    try{
        await ConnectDb();
        const redisClient =  setConnectionRedis();
        const storedOtp = await redisClient.get(`field-exec-otp-${email}`);
        if(storedOtp!==otp){
            return {message:"Invalid OTP",success:false};
        }
        const token = jwt.sign({email,type:"field-exec"},process.env.JWT_SECRET||"secretkey",{expiresIn:"7d"});
        return {message:"OTP verified successfully",token,success:true};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}

export const getFieldExecutiveByEmail = async (email:string) => {
    try{
        await ConnectDb();
        const fieldExecutive = await FieldExecutive.findOne({email,isActive:true});
        if(!fieldExecutive){
            return {message:"Field Executive not found",success:false};
        }
        return {message:"Field Executive fetched successfully",data:fieldExecutive,success:true};
    }
    catch(error){
        return {message:"Internal Server Error",success:false};
    }
}