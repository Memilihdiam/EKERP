const brcrypt = require('bcrypt');
const pool = require("../../../config/db");
const redisClient = require("../../../config/redis");
const { httpStatus } = require("../../../utils/util");
const repository = require("./employee.repository");
const roleService = require("../../cores/roles/role.service");
const jobService = require("../jobs/job.service")
const codeGen = require("../../../utils/code-generator");

exports.getEmployeeList = async () => {
    const cachedKey = 'list-employees';
    const cachedEx = 3600;

    const cacheData = await redisClient.get(cachedKey);
    if(cacheData){
        return {employees: JSON.parse(cacheData) };
    }

    const employees = await repository.getEmployeeList();
    if(employees.length === 0){
        return { employees: [] };
    }

    await redisClient.set(cachedKey, JSON.stringify(employees), 'EX', cachedEx);

    return { employees };
}

exports.getDataForAdd = async () => {
    const cachedKey = 'list-ptkp';
    const cachedEx = 3600;

    const cacheData = await redisClient.get(cachedKey);
    if(cacheData){
        return JSON.parse(cacheData);
    }

    const ptkp_status = await repository.getPtkpStatus();
    if(ptkp_status.length === 0){
        return { ptkp_status: [] };
    }

    const employement_status = await repository.getEmployementStatus();
    if(employement_status.length === 0){
        return { employement_status: [] };
    }

    const result = {ptkp_status, employement_status}

    await redisClient.set(cachedKey, JSON.stringify(result), 'EX', cachedEx);
    return { ptkp_status, employement_status };
}

exports.addEmployee = async (employeeData) => {
    if(!employeeData){
        const error = new Error("Field Can't Be Null");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    const year = new Date().getFullYear();

    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const { job } = await jobService.getDepartmentByJobId(employeeData.position_id, connection);

        const yearSequence = await repository.findYearSequence(year, connection);
        const employeeCode = codeGen.employeeCode(job.department_code, year, yearSequence.next_year_seq);

        const hashPass = await brcrypt.hash(employeeData.password, 10);

        const dataFix = {
            ...employeeData,
            year_sequence_join: yearSequence.next_year_seq,
            employee_code: employeeCode,
            password: hashPass,
            image_path: null
        }

        const userId = await repository.addEmployee(dataFix, connection);

        await repository.employementStatus(employeeData.status_id, userId, employeeData.start_work, employeeData.end_work, connection);

        await roleService.employeeRole(userId, employeeData.role_id, connection);

        await connection.commit();
        await redisClient.del('list-employees');
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}