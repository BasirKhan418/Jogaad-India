import ConnectEmailClient from "@/middleware/connectEmailClient";
export const sendOtpEmail = async (email: string, otp: string) => {
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
            return {message:"Error sending OTP email",error:emailError,success:false};
        }
        
        return {message:"OTP sent to your email",success:true};
}