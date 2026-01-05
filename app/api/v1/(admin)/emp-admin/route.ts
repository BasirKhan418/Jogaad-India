import { NextResponse,NextRequest } from "next/server";
import {cookies} from "next/headers";
import { verifyUserToken } from "@/utils/user/usertoken.verify";
import { getAllEmployees } from "@/repository/employee/employee.auth";
import { getCategoryById } from "@/repository/admin/category";
import { createEmployee } from "@/repository/employee/employee.auth";
import { updateEmployeeByEmail } from "@/repository/employee/employee.auth";
import { EmployeeZodSchema } from "@/validator/employee/employee.auth";
import { deleteEmployeeByEmail } from "@/repository/employee/employee.auth";
export const GET = async (request:NextRequest) => {
try{
const cookiesStore = await cookies();
const token = cookiesStore.get("token")?.value||"";
const isTokenValid = await verifyUserToken(token);
if(!isTokenValid.success||isTokenValid.type!=="admin"){
    return NextResponse.json({message:"Invalid token",success:false}, {status:401});
}
const response = await getAllEmployees();
return NextResponse.json(response);
}
catch(error){
    return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
}
}

export const POST = async (request:Request) => {
try{
const cookiesStore = await cookies();
const token = cookiesStore.get("token")?.value||"";
const isTokenValid = await verifyUserToken(token);
if(!isTokenValid.success||isTokenValid.type!=="admin"){
    return NextResponse.json({message:"Invalid token",success:false}, {status:401});
}
const reqBody = await request.json();
const parseResult = EmployeeZodSchema.safeParse(reqBody);
if(!parseResult.success){
    return NextResponse.json({message:"Invalid request data",success:false,errors:parseResult.error.format()}, {status:400});
}

// Handle empty categoryid (convert to undefined for MongoDB)
if (reqBody.categoryid === '' || !reqBody.categoryid) {
    delete reqBody.categoryid;
}

if (!reqBody.categoryid) {
    // For "Other" category - skip category validation
    let newdata = reqBody;
    if(reqBody.isPaid){
        newdata = {...reqBody, paymentStatus:"paid", isActive:true};
    }
    const response = await createEmployee(newdata);
    return NextResponse.json(response);
}

const getcateory = await getCategoryById(reqBody.categoryid);
if(!getcateory.success){
    return NextResponse.json({message:"Category not found",success:false}, {status:404});   
}
if(reqBody.payrate<getcateory.category.categoryMinPrice||reqBody.payrate>getcateory.category.categoryMaxPrice){
    return NextResponse.json({message:`Payrate must be between ${getcateory.category.categoryMinPrice} and ${getcateory.category.categoryMaxPrice}`,success:false}, {status:400});
}
let newdata= reqBody;
if(reqBody.isPaid){
    newdata ={...reqBody,paymentStatus:"paid",isActive:true};
}
const response = await createEmployee(newdata);
return NextResponse.json(response);
}

catch(error){
    return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
}
}

export const PUT = async (request:Request) => {
try{
const cookiesStore = await cookies();
const token = cookiesStore.get("token")?.value||"";
const isTokenValid = await verifyUserToken(token);
if(!isTokenValid.success||isTokenValid.type!=="admin"){
    return NextResponse.json({message:"Invalid token",success:false}, {status:401});
}
const reqBody = await request.json();
const parseResult = EmployeeZodSchema.partial({email:true}).safeParse(reqBody);
if(!parseResult.success){
    return NextResponse.json({message:"Invalid request data",success:false,errors:parseResult.error.format()}, {status:400});
}

// Handle empty categoryid (convert to undefined for MongoDB)
if (reqBody.categoryid === '' || !reqBody.categoryid) {
    delete reqBody.categoryid;
}

if (!reqBody.categoryid) {
    // For "Other" category - skip category validation
    const response = await updateEmployeeByEmail(reqBody.email!, reqBody);
    return NextResponse.json(response);
}

const categoryCheck = await getCategoryById(reqBody.categoryid);
if(!categoryCheck.success){
    return NextResponse.json({message:"Category not found",success:false}, {status:404});   
}
    if(reqBody.payrate<categoryCheck.category.categoryMinPrice||reqBody.payrate>categoryCheck.category.categoryMaxPrice){
        return NextResponse.json({message:`Payrate must be between ${categoryCheck.category.categoryMinPrice} and ${categoryCheck.category.categoryMaxPrice}`,success:false}, {status:400});
    }
const response = await updateEmployeeByEmail(reqBody.email!,reqBody);
return NextResponse.json(response);
}
catch(error){
    return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
}
}
export const DELETE = async (request:Request) => {
try{
const cookiesStore = await cookies();
const token = cookiesStore.get("token")?.value||"";
const isTokenValid = await verifyUserToken(token);
if(!isTokenValid.success||isTokenValid.type!=="admin"){
    return NextResponse.json({message:"Invalid token",success:false}, {status:401});
}
const reqBody = await request.json();
const response = await deleteEmployeeByEmail(reqBody.email);
return NextResponse.json(response);
}
catch(error){
    return NextResponse.json({message:"Internal Server Error",success:false}, {status:500});
}
}