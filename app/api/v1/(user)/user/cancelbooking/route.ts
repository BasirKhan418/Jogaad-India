import { NextResponse, NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { getBookingById } from "@/repository/user/booking";
import { isFineImposedForBooking } from "@/repository/user/booking";
import { RefundBookingPayment } from "@/utils/user/refund";
import { markFine } from "@/repository/user/booking";
//untested endpoint after payment will check fine imposition and refund accordingly
export const POST = async (request: NextRequest) => {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value || "";
        const isTokenValid = await verifyUserToken(token);
        if (!isTokenValid.success || isTokenValid.type !== "user") {
            return NextResponse.json({ message: "Invalid token", success: false }, { status: 401 });
        }
        const data = await request.json();
        const { id } = data;
        if (!id) {
            return NextResponse.json({ message: "ID is required to cancel the booking", success: false }, { status: 400 });
        }
        const bookingdata = await getBookingById(id);
        if (!bookingdata.success) {
            return NextResponse.json({ message: "Booking not found", success: false }, { status: 404 });
        }
        const fineData = await isFineImposedForBooking(id);
        if (!fineData.success) {
            return NextResponse.json({ message: "Error checking fine status", success: false }, { status: 500 });
        }
        if (fineData.data?.fine) {
            const markfine = await markFine(bookingdata.data.userid.toString());
            if (!markfine.success) {
                return NextResponse.json({ message: "Error imposing fine", success: false }, { status: 500 });
            }
            const response = await RefundBookingPayment(bookingdata.data.paymentid!, bookingdata.data.intialamount * 100);
            if (!response.success) {
                return NextResponse.json({ message: "Error processing refund", success: false }, { status: 500 });
            }
            return NextResponse.json({ message: "Booking cancelled and refund processed successfully", success: true }, { status: 200 });

        }
        const response = await RefundBookingPayment(bookingdata.data.paymentid!, bookingdata.data.intialamount * 100);
        if (!response.success) {
            return NextResponse.json({ message: "Error processing refund", success: false }, { status: 500 });
        }
        return NextResponse.json({ message: "Booking cancelled and refund processed successfully", success: true }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}