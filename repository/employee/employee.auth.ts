import ConnectDb from "@/middleware/connectDb";
import Employee from "@/models/Employee";
import { EmployeeInput } from "@/validator/employee/employee.auth";

export const createEmployee = async (employeeData: EmployeeInput) => {
    try{
        await ConnectDb();
        const newEmployee = new Employee(employeeData);
        await newEmployee.save();
        return {message:"Employee created successfully",employee:newEmployee,success:true};
    }
    catch(error){
        return {message:"Error creating employee",error,success:false};
    }
}

export const getEmployeeByEmail = async (email: string) => {
    try{
        await ConnectDb();
        const employee = await Employee.findOne({email});
        if(employee){
            return {message:"Employee retrieved successfully",employee,success:true};
        }
        return {message:"Employee not found",success:false};
    }
    catch(error){
        return {message:"Error retrieving employee",error,success:false};
    }
}

export const updateEmployeeByEmail = async (email: string, updateData: EmployeeInput) => {
    try{
        await ConnectDb();
        const updatedEmployee = await Employee.findOneAndUpdate({email:email},updateData,{new:true});
        if(updatedEmployee){
            return {message:"Employee updated successfully",employee:updatedEmployee,success:true};
        }
        return {message:"Employee not found",success:false};
    }
    catch(error){
        return {message:"Error updating employee",error,success:false};
    }
}

export const getAllEmployees = async () => {
    try{
        await ConnectDb();
        const employees = await Employee.find();
        return {message:"Employees retrieved successfully",employees,success:true};
    }
    catch(error){
        return {message:"Error retrieving employees",error,success:false};
    }
}

export const deleteEmployeeByEmail = async (email: string) => {
    try{
        await ConnectDb();
        const deletedEmployee = await Employee.findOneAndDelete({email});
        if(deletedEmployee){
            return {message:"Employee deleted successfully",success:true};
        }
        return {message:"Employee not found",success:false};
    }
    catch(error){
        return {message:"Error deleting employee",error,success:false};
    }
}

export const updateOrderidByEmail = async (email: string, orderId: string) => {
    try{
        await ConnectDb();
        const updatedEmployee = await Employee.findOneAndUpdate({email},{orderid:orderId},{new:true});
        if(updatedEmployee){
            return {message:"Employee order ID updated successfully",employee:updatedEmployee,success:true};
        }
        return {message:"Employee not found",success:false};
    }
    catch(error){
        return {message:"Error updating employee order ID",error,success:false};
    }
}