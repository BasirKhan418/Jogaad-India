import ConnectDb from "@/middleware/connectDb";
import Admin from "@/models/Admin";
import setConnectionRedis from "@/middleware/connectRedis";
import { sendOtpEmail } from "@/email/user/sendOtp";
import jwt from "jsonwebtoken";
export const createAdmin= async (userData: any) => {
    try{
        await ConnectDb();
        const newUser = new Admin(userData);
        await newUser.save();
        return {message:"Admin created successfully",admin:newUser,success:true};
    }
    catch(error){
        return {message:"Error creating admin",error,success:false};
    }
}
//verify admin by email
export const verifyAdminByEmail = async (email: string) => {
    try{
        await ConnectDb();
        const admin = await Admin.findOne({email});
        if(admin){
            return {message:"Admin verified successfully",data:admin,success:true,type:"admin"};
        }
        return {message:"Admin not found",success:false};
    }
    catch(err){
        return {message:"Error verifying admin",err,success:false};
    }
}
//update admin by email
export const updateAdminByEmail = async (email: string, updateData: any) => {
    try{
        await ConnectDb();
        const updatedAdmin = await Admin.findOneAndUpdate({email},updateData,{new:true});
        if(updatedAdmin){
            return {message:"Admin updated successfully",admin:updatedAdmin,success:true};
        }
        return {message:"Admin not found",success:false};
    }
    catch(error){
        return {message:"Error updating admin",error,success:false};
    }
}   

//admin auth functions
export const generateOTP = async (email: string,) => {
    try{
        await ConnectDb();
        
       
            const admin = await Admin.findOne({email});
            if(!admin){
                return {message:"Admin not found! Please register first.",success:false};
            }
       
        
        const redisClient = setConnectionRedis();
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Generated OTP for ${email}: ${otp}`);
        await redisClient.set(`otp-admin:${email}`, otp, "EX", 300);
        const emailResponse = await sendOtpEmail({ email, otp, isAdmin: true });
        if(!emailResponse.success){
            return {message:"Failed to send OTP email",success:false};
        }
        return {message:"OTP generated and sent successfully",success:true};
        
        // Send OTP via email
      
    }
    catch(error){
        console.log(error);
        return {message:"Error generating OTP",error,success:false};
    }
}

export const verifyOTP = async (email: string, otp: string) => {
    try{
        const redisClient = setConnectionRedis();
        await ConnectDb();
        const storedOtp = await redisClient.get(`otp-admin:${email}`);
        if(storedOtp === otp){
            // Update user's verification status if user exists
            const user = await Admin.findOneAndUpdate({email},{isVerified:true},{new:true});
            await redisClient.del(`otp-admin:${email}`);
            
            // Generate token with user's name if available, otherwise just email
            const token = jwt.sign({email,type:"admin",name:user?.name || "Admin"},process.env.JWT_SECRET||"",{expiresIn:"7d"});
            return {message:"OTP verified successfully",success:true,token};
        }
        return {message:"Invalid OTP",success:false};
    }
    catch(error){
        return {message:"Error verifying OTP",error,success:false};
    }
}