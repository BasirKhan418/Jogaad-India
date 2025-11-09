import jwt from "jsonwebtoken";
export const verifyUserToken = async (token:string) => {
    try{
        const decoded:any = jwt.verify(token,process.env.JWT_SECRET||"");
        if(decoded && decoded.type==="user"){
            return {message:"User token verified successfully",email:decoded.email,name:decoded.name,success:true};
        }
        return {message:"Invalid user token",success:false};
    }
    catch(error){
        return {message:"Error verifying user token",error,success:false};
    }
}