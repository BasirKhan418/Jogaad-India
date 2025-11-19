import { NextResponse,NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { deleteAdminById } from "@/repository/admin/admin.auth";
export const POST = async (request: NextRequest) => {
    try{
        const cookieStore = await cookies();
        const userToken = cookieStore.get("token")?.value || "";
        const verifyResult = await verifyUserToken(userToken);
        if(!verifyResult.success||verifyResult.type!=="admin"){
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            }, { status: 401 });
        }
        const {id} = await request.json();
        const deleteResult = await deleteAdminById(id);
        return NextResponse.json(deleteResult);

    }
    catch(error){
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });
    }
}