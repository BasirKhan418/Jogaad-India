import ConnectDb from "@/middleware/connectDb";
import Category from "@/models/Category";
import { CategoryInput } from "@/validator/admin/category";
//create category
export const createCategory = async (categoryData: CategoryInput) => {
    try{
        await ConnectDb();
        const newCategory = new Category(categoryData);
        await newCategory.save();
        return {message:"Category created successfully",category:newCategory,success:true};
    }
    catch(error){
        return {message:"Error creating category",error,success:false};
    }
}
//update category by id
export const updateCategoryById = async (id: string, updateData: any) => {
    try{
        await ConnectDb();
        const updatedCategory = await Category.findByIdAndUpdate(id,updateData,{new:true});
        if(updatedCategory){
            return {message:"Category updated successfully",category:updatedCategory,success:true};
        }
        return {message:"Category not found",success:false};
    }
    catch(error){
        return {message:"Error updating category",error,success:false};
    }
}
//get all categories

export const getAllCategories = async () => {
    try{
        await ConnectDb();
        const categories = await Category.find({});
        return {message:"Categories fetched successfully",categories,success:true};
    }
    catch(error){
        return {message:"Error fetching categories",error,success:false};
    }
}

export const getCategoryByType = async (type: string) => {
try{
await ConnectDb();
const categories = await Category.find({categoryType:type});
return {message:"Categories fetched successfully",categories,success:true};
}
catch(error){
    return {message:"Error fetching categories by type",error,success:false};
}
}

export const getCategoryById = async (id: string) => {
    try{
        await ConnectDb();
        const category = await Category.findById(id);
        if(category){
            return {message:"Category fetched successfully",category,success:true};
        }
        return {message:"Category not found",success:false};
    }
    catch(error){
        return {message:"Error fetching category by id",error,success:false};
    }
}

