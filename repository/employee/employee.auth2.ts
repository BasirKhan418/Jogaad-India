import ConnectDb from "@/middleware/connectDb";
import setConnectionRedis from "@/middleware/connectRedis";
import Employee from "@/models/Employee";
import { sendEmployeeOtpEmail } from "@/email/employee/sendOtp";
import jwt from "jsonwebtoken";
export const SendOtpEmployee=async(email:string)=>{
    try{
        await ConnectDb();
        const redisClient = setConnectionRedis();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const isEligible = await Employee.findOne({email,isPaid:true});
        if(!isEligible){
            return {message:"No active employee account found with this email",success:false};
        }
        await redisClient.set(`otp-employee:${email}`,otp,"EX",5*60); //expire in 10 minutes
        const data = await sendEmployeeOtpEmail({ email, otp });
        if(!data.success){
            return {message:"error sending otp ",success:false}
        }
        return {message:"OTP sent successfully",success:true};
    }
    catch(error){
        return {message:"Error sending OTP",error,success:false};
    }
}


export const verifyOTPEmployee = async (email: string, otp: string) => {
    try{
        const redisClient = setConnectionRedis();
        await ConnectDb();
        const storedOtp = await redisClient.get(`otp-employee:${email}`);
        if(storedOtp === otp){
            // Update user's verification status if user exists
           
            await redisClient.del(`otp-employee:${email}`);
            
            // Generate token with user's name if available, otherwise just email
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error('JWT_SECRET environment variable is not set');
            }
            const token = jwt.sign({email,type:"employee",name:"Employee"}, jwtSecret, {expiresIn:"7d"});
            return {message:"OTP verified successfully",success:true,token};
        }
        return {message:"Invalid OTP",success:false};
    }
    catch(error){
        return {message:"Error verifying OTP",error,success:false};
    }
}

