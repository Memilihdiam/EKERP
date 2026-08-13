const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const redisClient = require('../../../config/redis');
const { httpStatus } = require('../../../utils/util');
const repository = require('./user.repository');

exports.authService = async (userId, password) => {
    if(!userId || !password){
        const error = new Error("Field Can't Be Null");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }
    const userData = await repository.findUserByEmployeeCode(userId);

    if(!userData){
        const error = new Error("Invalid User Code");
        error.statusCode = httpStatus.notFound;
        throw error;
    }

    const validPass = await bcrypt.compare(password, userData.password);
    if(!validPass){
        const error = new Error("Invallid User Password");
        error.statusCode = httpStatus.notFound;
        throw error;
    }

    const sessionId = uuidv4();
    
    const token = jwt.sign(
        {
            id: userData.id,
            userCode: userData.employee_code,
            role: userData.role_name
        },
        process.env.JWT_SECRET,
        {expiresIn: '1D'}
    )

    const oneDay = 60 * 60 * 24;

    await redisClient.set(`session:${sessionId}`, token, 'EX', oneDay);

    return { sessionId };
}