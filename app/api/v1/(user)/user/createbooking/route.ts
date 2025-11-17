import { NextResponse,NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { getFees } from "@/repository/admin/fees";
import { verifyUserByEmail } from "@/repository/user/user.auth";
import { BookingSchemaZod } from "@/validator/user/booking";
import { CreateBookingRazorPay } from "@/utils/user/createBooking";
import { createUserBooking } from "@/repository/user/booking";
export const POST = async (request:NextRequest) => {
    try{
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="user"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const data = await request.json();
        const feesData = await getFees();
        console.log("feesData",feesData);
        const user = await verifyUserByEmail(isTokenValid.email);
        if(!feesData.success){
            return NextResponse.json({message:"Fees data not found",success:false}, {status:404});
        }
        if(!user.success){
            return NextResponse.json({message:"User not found",success:false}, {status:404});
        }
        let amount :number=0;
        if(user.data.isImposedFine){
            amount +=(feesData.data.userOneTimeFee&&feesData.data.userOneTimeFee + feesData.data.fineFees&&feesData.data.fineFees )*100;
        }
        amount += feesData.data.userOneTimeFee&&feesData.data.userOneTimeFee*100;
        console.log("amount",amount);
        const receipt = `booking_rcpt_${new Date().getTime()}`;
        const orderdata = await CreateBookingRazorPay(amount, "INR", receipt);
        if(!orderdata.success){
            return NextResponse.json({message:orderdata.message,success:false}, {status:500});
        }
        const orderId = (orderdata as any)?.order?.id;
        const newData = {...data, userid: user.data._id.toString(), intialamount: amount/100, intialpaymentStatus: "pending", orderid:orderId};
        console.log("newData",newData);
        const validate = BookingSchemaZod.safeParse(newData);
        console.log("validate",validate);
        if(!validate.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const bookingdata = await createUserBooking(validate.data);
      
        if(!bookingdata.success){
            return NextResponse.json({message:"Error creating booking",success:false}, {status:500});
        }
        return NextResponse.json({message:"Booking created successfully",order:orderdata.order,booking:bookingdata.data,success:true}, {status:201});
        


    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}