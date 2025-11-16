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
        
        // Check if employee account exists
        const employee = await Employee.findOne({email});
        
        // Case 1: No account found - user needs to create account
        if(!employee){
            return {
                message:"No employee account found. Please create an account first.",
                success:false,
                redirect: "/employee/create"
            };
        }
        
        // Case 2: Account exists but payment not completed
        if(!employee.isPaid){
            return {
                message:"Your account is pending payment. Please complete payment to activate.",
                success:false,
                requiresPayment: true,
                redirect: "/employee/create"
            };
        }
        
        // Case 3: Account is active and paid - send OTP
        await redisClient.set(`otp-employee:${email}`,otp,"EX",5*60); //expire in 5 minutes
        const data = await sendEmployeeOtpEmail({ email, otp });
        if(!data.success){
            return {message:"Error sending OTP. Please try again.",success:false}
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

