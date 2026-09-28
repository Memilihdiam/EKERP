const redisClient = require("../../../config/redis");
const { httpStatus } = require("../../../utils/util");
const repository = require("./role.repository");

exports.getRoles = async () => {
    const cachedKey = 'all-roles';
    const cachedEx = 3600;

    const cacheData = await redisClient.get(cachedKey);
    if(cacheData){
        return { roles: JSON.parse(cacheData) };
    }

    const roles = await repository.getRoles();
    if(roles.length === 0){
        return { roles: [] };
    }

    await redisClient.set(cachedKey, JSON.stringify(roles), 'EX', cachedEx);
    return { roles };
}

exports.employeeRole = async (employeeId, roleId, connection) => {
    if(!employeeId || !roleId){
        const error = new Error("Attribute Null");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    await repository.addEmployeeRole(employeeId, roleId, connection);
}