import { NextResponse,NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { getEmployeeByCategoryId } from "@/repository/employee/employee.auth";
export const GET = async (request: NextRequest) => {
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
        const url = new URL(request.url);
        const categoryId = url.searchParams.get("categoryid")||"";
        if(!categoryId){
            return NextResponse.json({
                message: "Category ID is required",
                success: false
            }, { status: 400 });
        }
        const response = await getEmployeeByCategoryId(categoryId);
        return NextResponse.json(response);

    }
    catch(error){
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });

    }
}