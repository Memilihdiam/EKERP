const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const redisClient = require('../../../config/redis');
const { httpStatus } = require('../../../utils/util');
const repository = require('./user.repository');
const pool = require('../../../config/db');

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

exports.userData = async (userId) => {
    if(!userId){
        const error = new Error('Not Found User ID');
        error.statusCode = httpStatus.notFound;
        throw error;
    }

    const cachedKey = `user:${userId}`;
    const cachedEx = 3600;

    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { user: JSON.parse(cacheData) };
        }

        const user = await repository.findUserById(userId);
        if(!user){
            const error = new Error('Not Found User');
            error.statusCode = httpStatus.notFound;
            throw error;
        }

        await redisClient.set(cachedKey, JSON.stringify(user), 'EX', cachedEx);
        return { user };
    }catch(err){
        throw err;
    }
}

exports.changePassword = async (userId, oldPassword, password) => {
    if(!password){
        const error = new Error("Field can't Be Null");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    console.log(`${oldPassword} -> ${password}`);
    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const checkPassword = await repository.checkPassword(userId, connection);
        console.log(checkPassword);
        const compareOldPass = await bcrypt.compare(oldPassword, checkPassword.password);
        if(!compareOldPass){
            const error = new Error("Password Does'nt Match");
            error.statusCode = httpStatus.forbidden;
            throw error;
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await repository.changePassword(userId, hashPassword, connection);
        await connection.commit();
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}