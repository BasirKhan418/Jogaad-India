import { NextResponse, NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { getBookingById, updateBookingStatus } from "@/repository/user/booking";
import { isFineImposedForBooking } from "@/repository/user/booking";
import { RefundBookingPayment } from "@/utils/user/refund";
import { markFine } from "@/repository/user/booking";
import Schedule from "@/models/Schedule";
import ConnectDb from "@/middleware/connectDb";

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
        const bookingResult = await getBookingById(id);
        
        if (!bookingResult.success || !bookingResult.data) {
            return NextResponse.json({ message: "Booking not found", success: false }, { status: 404 });
        }

        const booking = bookingResult.data;

        // Check if booking can be cancelled
        if (["started", "in-progress", "completed", "cancelled", "refunded"].includes(booking.status)) {
            return NextResponse.json({ message: "Cannot cancel this booking", success: false }, { status: 400 });
        }

        // If payment is done, process refund
        if (booking.intialPaymentStatus === "paid") {
            const fineData = await isFineImposedForBooking(id);
            if (!fineData.success) {
                return NextResponse.json({ message: "Error checking fine status", success: false }, { status: 500 });
            }

            if (fineData.data?.fine) {
                const markfine = await markFine(booking.userid.toString());
                if (!markfine.success) {
                    return NextResponse.json({ message: "Error imposing fine", success: false }, { status: 500 });
                }
            }

            if (booking.paymentid) {
                const response = await RefundBookingPayment(booking.paymentid, booking.intialamount * 100);
                if (!response.success) {
                    return NextResponse.json({ message: "Error processing refund", success: false }, { status: 500 });
                }

                // Delete any pending schedule so employee doesn't see it
                await ConnectDb();
                await Schedule.findOneAndDelete({bookingid: id});
                
                await updateBookingStatus(id, "refunded", {
                    refundStatus: "processed",
                    refundAmount: booking.intialamount,
                    refundDate: new Date(),
                    refundid: (response.refund as any).id
                });

                return NextResponse.json({ message: "Booking cancelled and refund processed successfully", success: true }, { status: 200 });
            } else {
                // Paid but no payment ID (should not happen ideally)
                // Delete any pending schedule so employee doesn't see it
                await ConnectDb();
                await Schedule.findOneAndDelete({bookingid: id});
                await updateBookingStatus(id, "cancelled");
                return NextResponse.json({ message: "Booking cancelled", success: true }, { status: 200 });
            }
        } else {
            // Payment not done, just cancel
            // Also delete any pending schedule so employee doesn't see it
            await ConnectDb();
            await Schedule.findOneAndDelete({bookingid: id});
            await updateBookingStatus(id, "cancelled");
            return NextResponse.json({ message: "Booking cancelled successfully", success: true }, { status: 200 });
        }
    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}