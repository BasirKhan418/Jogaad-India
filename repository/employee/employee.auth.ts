import ConnectDb from "@/middleware/connectDb";
import Employee from "@/models/Employee";
import "@/models/Category"; // Ensure Category model is registered for population
import { EmployeeInput } from "@/validator/employee/employee.auth";

export const createEmployee = async (employeeData: EmployeeInput) => {
    try{
        await ConnectDb();
        console.log('[createEmployee] payload:', employeeData);
        const newEmployee = new Employee(employeeData);
        await newEmployee.save();
        console.log('[createEmployee] saved employee othersCategory:', (newEmployee as any).othersCategory, 'description:', (newEmployee as any).description);
        return {message:"Employee created successfully",employee:newEmployee,success:true};
    }
    catch(error){
        console.error("Error creating employee:", error);
        return {message:"Error creating employee",error,success:false};
    }
}

export const getEmployeeByEmail = async (email: string) => {
    try{
        await ConnectDb();
        const employee = await Employee.findOne({email}).populate('categoryid');
        if(employee){
            return {message:"Employee retrieved successfully",data:employee,success:true};
        }
        return {message:"Employee not found",success:false};
    }
    catch(error){
        return {message:"Error retrieving employee",error,success:false};
    }
}

// Lookup without isActive filter - for idempotent create/account flows
export const getEmployeeByEmailAnyStatus = async (email: string) => {
    try{
        await ConnectDb();
        const employee = await Employee.findOne({ email }).populate('categoryid');
        if(employee){
            return {message:"Employee retrieved successfully",data:employee,success:true};
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
        // Normalize pincode to string if present
        const payload: any = { ...updateData };
        if (payload.pincode !== undefined && payload.pincode !== null) {
            payload.pincode = String(payload.pincode);
        }

        // Debug: observe pincode before update
        console.log('updateEmployeeByEmail -> email:', email, 'pincode:', payload.pincode, 'othersCategory:', payload.othersCategory, 'description:', payload.description);

        const updatedEmployee = await Employee.findOneAndUpdate(
            { email: email },
            { $set: payload },
            {new:true, runValidators: true}
        );
        if(updatedEmployee){
            console.log('updateEmployeeByEmail -> updated pincode:', updatedEmployee.pincode, 'othersCategory:', (updatedEmployee as any).othersCategory, 'description:', (updatedEmployee as any).description);
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

export const getEmployeeByCategoryId = async (categoryid: string) => {
    try{
        await ConnectDb();
        const employees = await Employee.find({categoryid, isActive: true}).select("name email phone address payrate img pincode");
        return {message:"Employees retrieved successfully",data:employees,success:true};
    }
    catch(error){
        return {message:"Error retrieving employees",error,success:false};
    }
}