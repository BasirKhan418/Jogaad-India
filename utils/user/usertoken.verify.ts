import jwt from "jsonwebtoken";
export const verifyUserToken = async (token:string) => {
    try{
        const jwtSecret = process.env.JWT_SECRET;
        console.log("JWT Secret:", jwtSecret);
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not set');
        }
        const decoded:any = jwt.verify(token, jwtSecret);
        if(decoded){
            return {message:"User token verified successfully",email:decoded.email,name:decoded.name,success:true,type:decoded.type};
        }
        return {message:"Invalid user token",success:false};
    }
    catch(error){
        return {message:"Error verifying user token",error,success:false};
    }
}