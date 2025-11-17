import { NextResponse,NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { fetchBookingsByStatus } from "@/repository/admin/booking";
import { fetchAllBookings } from "@/repository/admin/booking";
export const GET = async (request:NextRequest) => {
    try{
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="admin"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const url = new URL(request.url);
        const status = url.searchParams.get("status")||"";
        if(!status){
            const bookings = await fetchAllBookings();
            if(!bookings.success){
                return NextResponse.json({message:"Error fetching bookings",success:false}, {status:500});
            }
            return NextResponse.json({message:"Bookings fetched successfully",data:bookings.data,success:true}, {status:200});
        }
        const bookings = await fetchBookingsByStatus(status);
        if(!bookings.success){
            return NextResponse.json({message:"Error fetching bookings",success:false}, {status:500});
        }
        return NextResponse.json({message:"Bookings fetched successfully",data:bookings.data,success:true}, {status:200});

    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}