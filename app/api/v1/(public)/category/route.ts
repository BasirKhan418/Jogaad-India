import { NextResponse,NextRequest } from "next/server";
import { getAllCategories ,getCategoryByType} from "@/repository/admin/category";

export const GET = async (request:NextRequest) => {
    try{
        const { searchParams } = new URL(request.url);
        const categoryType = searchParams.get("type");
        if(!categoryType){
            const result = await getAllCategories();
            return NextResponse.json(result);
        }
        const result = await getCategoryByType(categoryType);
        return NextResponse.json(result);

    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}