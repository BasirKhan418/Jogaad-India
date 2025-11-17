import { NextResponse,NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { verifyUserByEmail } from "@/repository/user/user.auth";
import { getAllBookingsForUser } from "@/repository/user/booking";
export const GET = async (request:NextRequest) => {
    try{
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="user"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }   
        const user = await verifyUserByEmail(isTokenValid.email);
        if(!user.success){
            return NextResponse.json({message:"User not found",success:false}, {status:404});
        }
        const bookings = await getAllBookingsForUser(user.data._id.toString());
        if(!bookings.success){
            return NextResponse.json({message:"Error fetching bookings",success:false}, {status:500});
        }
        return NextResponse.json({message:"Bookings fetched successfully",data:bookings.data,success:true}, {status:200});
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}