import { NextResponse,NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { careerSchema } from "@/validator/admin/career";
import { getAllCareers,createCareer,updateCareer,deleteCareer } from "@/repository/admin/carrer";
import { verifyAdminByEmail } from "@/repository/admin/admin.auth";
export async function GET(request: NextRequest) {
    try{
        const cookiesStore = await cookies();
        const userToken = cookiesStore.get("token")?.value || "";
        const verifyToken = await verifyUserToken(userToken);

        if (!verifyToken.success || verifyToken.type !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        //get all jobs
        const result = await getAllCareers();
        return NextResponse.json(result);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",error}, {status:500});
    }
}

export async function POST(request: NextRequest) {
    try{
        const cookiesStore = await cookies();
        const userToken = cookiesStore.get("token")?.value || "";
        const verifyToken = await verifyUserToken(userToken);

        if (!verifyToken.success || verifyToken.type !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const requestBody = await request.json();
        const parsedData = careerSchema.safeParse(requestBody);

        if (!parsedData.success) {
            return NextResponse.json({ message: "Validation Error", success: parsedData.success }, { status: 400 });
        }
        const adminVerification = await verifyAdminByEmail(verifyToken.email);
        if (!adminVerification.success) {
            return NextResponse.json({ message: "Admin verification failed" }, { status: 401 });
        }
        const data= {
            ...parsedData.data,lastEditedAuthor:adminVerification.data._id.toString(),author:adminVerification.data._id.toString()}
        const result = await createCareer(data);
        return NextResponse.json(result);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",error}, {status:500});
    }
}

export async function PUT(request: NextRequest) {
    try{
        const cookiesStore = await cookies();
        const userToken = cookiesStore.get("token")?.value || "";
        const verifyToken = await verifyUserToken(userToken);

        if (!verifyToken.success || verifyToken.type !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const requestBody = await request.json();
        const { id, ...updateData } = requestBody;
        const parsedData = careerSchema.partial().safeParse(updateData);
        if (!parsedData.success) {
            return NextResponse.json({ message: "Validation Error", success: parsedData.success }, { status: 400 });
        }
        const adminVerification = await verifyAdminByEmail(verifyToken.email);
        if (!adminVerification.success) {
            return NextResponse.json({ message: "Admin verification failed" }, { status: 401 });
        }
        const data= {
            ...parsedData.data,lastEditedAuthor:adminVerification.data._id.toString(),author:adminVerification.data._id.toString()}
        const result = await updateCareer(id, data);
        return NextResponse.json(result);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",error}, {status:500});
    }
}

export async function DELETE(request: NextRequest) {
    try{
        const cookiesStore = await cookies();
        const userToken = cookiesStore.get("token")?.value || "";
        const verifyToken = await verifyUserToken(userToken);

        if (!verifyToken.success || verifyToken.type !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const requestBody = await request.json();
        const { id } = requestBody;
        const result = await deleteCareer(id);
        return NextResponse.json(result);
    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",error}, {status:500});
    }
}