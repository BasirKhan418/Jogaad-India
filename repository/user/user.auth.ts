import ConnectDb from "@/middleware/connectDb";
import User from "@/models/User";
import setConnectionRedis from "@/middleware/connectRedis";
import ConnectEmailClient from "@/middleware/connectEmailClient";
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
export const generateOTP = async (email: string, checkUserExists: boolean = true) => {
    try{
        await ConnectDb();
        
        // Only check if user exists when required (for sign-in)
        if(checkUserExists) {
            const user = await User.findOne({email});
            if(!user){
                return {message:"User not found! Please register first.",success:false};
            }
        }
        
        const redisClient = setConnectionRedis();
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Generated OTP for ${email}: ${otp}`);
        await redisClient.set(`otp-user:${email}`, otp, "EX", 300);
        
        // Send OTP via email
        try {
            const emailTransporter = await ConnectEmailClient();
            if(emailTransporter) {
                await emailTransporter.sendMail({
                    from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: "Your OTP for Jogaad India",
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: linear-gradient(135deg, #2B9EB3 0%, #0A3D62 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                                .otp-box { background: white; border: 2px solid #2B9EB3; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                                .otp-code { font-size: 32px; font-weight: bold; color: #0A3D62; letter-spacing: 5px; }
                                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>Jogaad India</h1>
                                    <p>Your One-Time Password</p>
                                </div>
                                <div class="content">
                                    <h2>Hello!</h2>
                                    <p>You requested an OTP to access your Jogaad India account. Use the code below to complete your verification:</p>
                                    
                                    <div class="otp-box">
                                        <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                                        <p class="otp-code">${otp}</p>
                                    </div>
                                    
                                    <p><strong>This OTP will expire in 5 minutes.</strong></p>
                                    <p>If you didn't request this code, please ignore this email.</p>
                                    
                                    <div class="footer">
                                        <p>© 2025 Jogaad India. All rights reserved.</p>
                                        <p>This is an automated email, please do not reply.</p>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                    text: `Your OTP for Jogaad India is: ${otp}\n\nThis OTP will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this email.`
                });
                console.log(`OTP email sent successfully to ${email}`);
            }
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }
        
        return {message:"OTP sent to your email",success:true};
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
            // Update user's verification status if user exists
            const user = await User.findOneAndUpdate({email},{isVerified:true},{new:true});
            await redisClient.del(`otp-user:${email}`);
            
            // Generate token with user's name if available, otherwise just email
            const token = jwt.sign({email,type:"user",name:user?.name || "User"},process.env.JWT_SECRET||"",{expiresIn:"7d"});
            return {message:"OTP verified successfully",success:true,token};
        }
        return {message:"Invalid OTP",success:false};
    }
    catch(error){
        return {message:"Error verifying OTP",error,success:false};
    }
}