import ConnectDb from "@/middleware/connectDb";
import User from "@/models/User";
import setConnectionRedis from "@/middleware/connectRedis";
import jwt from "jsonwebtoken";
export const createUser = async (userData: any) => {
    try{
        await ConnectDb();
        const newUser = new User(userData);
        await newUser.save();
        return {message:"User created successfully",user:newUser,success:true};
    }
    catch(error){
        return {message:"Error creating user",error,success:false};
    }
}
//verify user by email
export const verifyUserByEmail = async (email: string) => {
    try{
        await ConnectDb();
        const user = await User.findOne({email});
        if(user){
            return {message:"User verified successfully",user,success:true};
        }
        return {message:"User not found",success:false};
    }
    catch(err){
        return {message:"Error verifying user",err,success:false};
    }
}
//update user by email
export const updateUserByEmail = async (email: string, updateData: any) => {
    try{
        await ConnectDb();
        const updatedUser = await User.findOneAndUpdate({email},updateData,{new:true});
        if(updatedUser){
            return {message:"User updated successfully",user:updatedUser,success:true};
        }
        return {message:"User not found",success:false};
    }
    catch(error){
        return {message:"Error updating user",error,success:false};
    }
}   

//user auth functions
export const generateOTP = async (email: string) => {
    try{
        await ConnectDb();
        const user = await User.findOne({email});
        if(!user){
            return {message:"User not found! Please register first.",success:false};
        }
        const redisClient = setConnectionRedis();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Generated OTP for ${email}: ${otp}`);
        await redisClient.set(`otp-user:${email}`, otp, "EX", 300);
        //send email functionality can be added here later
        return {message:"OTP generated successfully",success:true};
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
        const storedOtp = await redisClient.get(`otp-user:${email}`);
        if(storedOtp === otp){
            const user = await User.findOneAndUpdate({email},{isVerified:true},{new:true});
            await redisClient.del(`otp-user:${email}`);
            const token = jwt.sign({email,type:"user",name:user?.name},process.env.JWT_SECRET||"",{expiresIn:"7d"});
            return {message:"OTP verified successfully",success:true,token};
        }
        return {message:"Invalid OTP",success:false};
    }
    catch(error){
        return {message:"Error verifying OTP",error,success:false};
    }
}