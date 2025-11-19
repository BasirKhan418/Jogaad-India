import { NextResponse,NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { rateBooking } from "@/repository/user/booking";
export const POST = async (request: NextRequest) => {
    try{
        const cookieStore = await cookies();
        const userToken = cookieStore.get("token")?.value || "";
        const verifyResult = await verifyUserToken(userToken);
        if(!verifyResult.success||verifyResult.type!=="user"){
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            }, { status: 401 });
        }
        const {bookingid, rating, review} = await request.json();
        const rateResult = await rateBooking(bookingid, rating, review);
        return NextResponse.json(rateResult);

    }
    catch(error){
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });
    }
}