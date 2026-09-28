const { httpStatus } = require("../../../utils/util");
const service = require("./employee.service");
const roleService = require("../../cores/roles/role.service");

exports.getEmployees = async (req, res) => {
    try{
        const { employees } = await service.getEmployeeList();

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            employees
        })
    }catch(err){
        console.log('Error while fetch employees data, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.getDataForAdd = async (req, res) => {
    try{
        const { ptkp_status, employement_status } = await service.getDataForAdd();
        const { roles } = await roleService.getRoles();

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            ptkp_status,
            employement_status,
            roles
        })
    }catch(err){
        console.log('Error while fetch ptkp data, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.addEmployee = async (req, res) => {
    const employeeData = req.body;
    try{
        await service.addEmployee(employeeData);

        res.status(httpStatus.created).json({
            success: true,
            message: 'Successfuly Created Employee Data',
        })
    }catch(err){
        console.log('Error while created employee data, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}