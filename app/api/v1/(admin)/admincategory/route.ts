import { NextResponse,NextRequest } from "next/server";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { cookies } from "next/headers";
import { CategorySchemaZod } from "@/validator/admin/category";
import { createCategory,updateCategoryById,getAllCategories,getCategoryByType } from "@/repository/admin/category";
import { verifyAdminByEmail } from "@/repository/admin/admin.auth";

export const GET = async (request:NextRequest) => {
    try{
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="admin"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('id');
        const categoryType = searchParams.get('type');
        
        // If ID is provided, fetch single category
        if(categoryId){
            const Category = (await import("@/models/Category")).default;
            const category = await Category.findById(categoryId);
            
            if(!category){
                return NextResponse.json({message:"Category not found",success:false}, {status:404});
            }
            
            return NextResponse.json({category, success:true});
        }
        
        // If type is provided, filter by type
        if(categoryType && (categoryType === 'Service' || categoryType === 'Maintenance')){
            const result = await getCategoryByType(categoryType);
            return NextResponse.json(result);
        }
        
        // Otherwise return all categories
        const result = await getAllCategories();
        return NextResponse.json(result);
    }
    catch(error){
        console.error("Error in admin category GET:", error);
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}

export const POST = async (request:NextRequest) => {
    try{
        const data = await request.json();
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="admin"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const isAdmin = await verifyAdminByEmail(isTokenValid.email);
        if(!isAdmin){
            return NextResponse.json({message:"Unauthorized",success:false}, {status:403});
        }
        const newdata ={...data, updatedBy: isAdmin.data._id};
        const validateData = CategorySchemaZod.safeParse(newdata);
        if(!validateData.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const result = await createCategory(newdata);
        return NextResponse.json(result);

    }
    catch(error){
        console.error("Error in admin category POST:", error);
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}

export const PUT = async (request:NextRequest) => {
    try{
        const data = await request.json();
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="admin"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        const isAdmin = await verifyAdminByEmail(isTokenValid.email);
        if(!isAdmin){
            return NextResponse.json({message:"Unauthorized",success:false}, {status:403});
        }
        const newdata ={...data, updatedBy: isAdmin.data._id};
        const validateData = CategorySchemaZod.safeParse(newdata);
        if(!validateData.success){
            return NextResponse.json({message:"Invalid data",success:false}, {status:400});
        }
        const result = await updateCategoryById(data.id, newdata);
        return NextResponse.json(result);

    }
    catch(error){
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}

export const DELETE = async (request:NextRequest) => {
    try{
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('id');
        
        if(!categoryId){
            return NextResponse.json({message:"Category ID is required",success:false}, {status:400});
        }
        
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value||"";
        const isTokenValid = await verifyUserToken(token);
        if(!isTokenValid.success||isTokenValid.type!=="admin"){
            return NextResponse.json({message:"Invalid token",success:false}, {status:401});
        }
        
        const isAdmin = await verifyAdminByEmail(isTokenValid.email);
        if(!isAdmin){
            return NextResponse.json({message:"Unauthorized",success:false}, {status:403});
        }
        
        // Delete category
        const Category = (await import("@/models/Category")).default;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        
        if(!deletedCategory){
            return NextResponse.json({message:"Category not found",success:false}, {status:404});
        }
        
        return NextResponse.json({message:"Category deleted successfully",success:true}, {status:200});
    }
    catch(error){
        console.error("Error in admin category DELETE:", error);
        return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
    }
}